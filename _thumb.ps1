Add-Type -AssemblyName System.Drawing
$base = (Get-Location).Path
$srcDir = Get-ChildItem -Path $base -Directory | Where-Object { $_.Name -like 'g*sel' -and $_.Name -notlike '*Kopya*' } | Select-Object -First 1
if (-not $srcDir) { Write-Host 'gorsel klasoru bulunamadi'; exit 1 }
$src = $srcDir.FullName
$dst = Join-Path $base ($srcDir.Name + '-thumb')
if (-not (Test-Path $dst)) { New-Item -ItemType Directory -Path $dst | Out-Null }
$files = Get-ChildItem -Path $src -File
$maxSide = 200
$ok = 0; $fail = 0
foreach ($f in $files) {
  try {
    $bmp = [System.Drawing.Bitmap]::FromFile($f.FullName)
    $m = [Math]::Max($bmp.Width, $bmp.Height)
    $ratio = $maxSide / $m
    if ($ratio -ge 1) { $ratio = 1.0 }
    $w = [int][Math]::Round($bmp.Width * $ratio)
    $h = [int][Math]::Round($bmp.Height * $ratio)
    if ($w -lt 1) { $w = 1 }; if ($h -lt 1) { $h = 1 }
    $thumb = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($thumb)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.DrawImage($bmp, 0, 0, $w, $h)
    $out = Join-Path $dst $f.Name
    $thumb.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $thumb.Dispose(); $bmp.Dispose()
    $ok++
  } catch {
    $fail++
    Write-Host "FAIL: $($f.Name) -> $($_.Exception.Message)"
  }
}
Write-Host "DST=$dst"
Write-Host "OK=$ok FAIL=$fail"