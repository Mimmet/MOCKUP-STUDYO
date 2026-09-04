param(
  [string]$Port = '9222',
  [string]$Eval = "document.getElementById('smoke-log') ? document.getElementById('smoke-log').innerText : 'NO-SMOKE-LOG'"
)
# Chrome CDP'ye WebSocket ile bağlanıp Runtime.evaluate çalıştırır.
$ErrorActionPreference = 'Stop'
function Get-PageWs {
  $json = curl.exe -s "http://127.0.0.1:$Port/json"
  $pages = $json | ConvertFrom-Json
  $page = $pages | Where-Object { $_.type -eq 'page' -and $_.url -like '*localhost*' } | Select-Object -First 1
  if (-not $page) { $page = $pages | Where-Object { $_.type -eq 'page' } | Select-Object -First 1 }
  if (-not $page) { throw 'Sayfa bulunamadi' }
  return $page.webSocketDebuggerUrl
}
$wsUrl = Get-PageWs
$ws = [System.Net.WebSockets.ClientWebSocket]::new()
$ct = [System.Threading.CancellationToken]::None
$ws.ConnectAsync([Uri]$wsUrl, $ct).GetAwaiter().GetResult()

# Belirli id'ye ait yanıtı bulana dek mesajları oku
function Read-CdpResponse($targetId, $timeoutSec) {
  $deadline = [DateTime]::UtcNow.AddSeconds($timeoutSec)
  $buffer = New-Object byte[] 131072
  while ([DateTime]::UtcNow -lt $deadline) {
    if ($ws.State -ne [System.Net.WebSockets.WebSocketState]::Open) { return $null }
    $recvSeg = [System.ArraySegment[byte]]::new($buffer)
    $res = $ws.ReceiveAsync($recvSeg, $ct).GetAwaiter().GetResult()
    if ($res.Count -gt 0) {
      $msg = [System.Text.Encoding]::UTF8.GetString($buffer, 0, $res.Count)
      try {
        $obj = $msg | ConvertFrom-Json
        if ($obj.id -eq $targetId) { return $obj }
      } catch { /* event vs. */ }
    }
  }
  return $null
}
function Send-CdpRaw($id, $method, $params) {
  $msg = @{ id = $id; method = $method; params = $params } | ConvertTo-Json -Compress -Depth 6
  $bytes = [System.Text.Encoding]::UTF8.GetBytes($msg)
  $seg = [System.ArraySegment[byte]]::new($bytes)
  $ws.SendAsync($seg, [System.Net.WebSockets.WebSocketMessageType]::Text, $true, $ct).GetAwaiter().GetResult()
}

# 1) Runtime üzerinden smoke-log'u oku
Send-CdpRaw 1 'Runtime.evaluate' @{ expression = $Eval; returnByValue = $true }
$result = Read-CdpResponse 1 10
if ($result -and $result.result.result.value) {
  Write-Output $result.result.result.value
} elseif ($result -and $result.result.exceptionDetails) {
  Write-Output ('EXC: ' + $result.result.exceptionDetails.text)
} else {
  Write-Output 'NO-RESULT-or-empty'
}
$ws.Dispose()