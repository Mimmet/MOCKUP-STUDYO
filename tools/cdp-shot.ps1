param([string]$Port='9555',[int]$Width=390,[int]$Height=844,[string]$Out="shot.png")
$ErrorActionPreference='Stop'
$json = curl.exe -s "http://127.0.0.1:$Port/json/list"
$page = ($json | ConvertFrom-Json) | Where-Object { $_.type -eq 'page' } | Select-Object -First 1
$ws=[System.Net.WebSockets.ClientWebSocket]::new(); $ct=[System.Threading.CancellationToken]::None
$ws.ConnectAsync([Uri]$page.webSocketDebuggerUrl,$ct).GetAwaiter().GetResult()
$buf=New-Object byte[] 1048576
function Recv($id){
  while($true){
    $ms=New-Object System.IO.MemoryStream
    do {
      $seg=[System.ArraySegment[byte]]::new($buf)
      $r=$ws.ReceiveAsync($seg,$ct).GetAwaiter().GetResult()
      $ms.Write($buf,0,$r.Count)
    } while(-not $r.EndOfMessage)
    $m=[System.Text.Encoding]::UTF8.GetString($ms.ToArray())
    try{$o=$m|ConvertFrom-Json;if($o.id -eq $id){return $o}}catch{}
  }
}
function Send($id,$method,$params){$msg=@{id=$id;method=$method;params=$params}|ConvertTo-Json -Compress -Depth 8;$b=[System.Text.Encoding]::UTF8.GetBytes($msg);$ws.SendAsync([System.ArraySegment[byte]]::new($b),[System.Net.WebSockets.WebSocketMessageType]::Text,$true,$ct).GetAwaiter().GetResult()}
Send 1 'Emulation.setDeviceMetricsOverride' @{width=$Width;height=$Height;deviceScaleFactor=2;mobile=$true}
Recv 1|Out-Null
Start-Sleep 2
Send 2 'Page.captureScreenshot' @{format='png'}
$r=Recv 2
[IO.File]::WriteAllBytes($Out,[Convert]::FromBase64String($r.result.data))
Write-Output "saved $Out"
$ws.Dispose()
