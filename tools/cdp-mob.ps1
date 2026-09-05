param([string]$Port='9444',[int]$Width=390,[int]$Height=844,[string]$Eval="1+1")
$ErrorActionPreference='Stop'
$json = curl.exe -s "http://127.0.0.1:$Port/json/list"
$pages = $json | ConvertFrom-Json
$page = $pages | Where-Object { $_.type -eq 'page' } | Select-Object -First 1
$ws = [System.Net.WebSockets.ClientWebSocket]::new()
$ct = [System.Threading.CancellationToken]::None
$ws.ConnectAsync([Uri]$page.webSocketDebuggerUrl, $ct).GetAwaiter().GetResult()
$buf = New-Object byte[] 262144
function Recv($id) {
  while ($true) {
    $seg=[System.ArraySegment[byte]]::new($buf)
    $r=$ws.ReceiveAsync($seg,$ct).GetAwaiter().GetResult()
    $m=[System.Text.Encoding]::UTF8.GetString($buf,0,$r.Count)
    try { $o=$m|ConvertFrom-Json; if($o.id -eq $id){return $o} } catch {}
  }
}
function Send($id,$method,$params){
  $msg=@{id=$id;method=$method;params=$params}|ConvertTo-Json -Compress -Depth 8
  $b=[System.Text.Encoding]::UTF8.GetBytes($msg)
  $ws.SendAsync([System.ArraySegment[byte]]::new($b),[System.Net.WebSockets.WebSocketMessageType]::Text,$true,$ct).GetAwaiter().GetResult()
}
Send 1 'Emulation.setDeviceMetricsOverride' @{width=$Width;height=$Height;deviceScaleFactor=2;mobile=$true}
Recv 1 | Out-Null
Send 2 'Runtime.evaluate' @{ expression=$Eval; returnByValue=$true; awaitPromise=$true }
$v=(Recv 2).result.result.value
if ($v -is [string]) { $v } else { $v | ConvertTo-Json -Compress -Depth 5 }
$ws.Dispose()
