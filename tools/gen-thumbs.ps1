# Galeri gor selleri icin kucuk thumbnail uretir (System.Drawing).
# Kaynak dizini otomatik bulur (Turkce karakter kodlamasi sorununu onler).
Add-Type -AssemblyName System.Drawing

$root = Get-Location
$extRe = '\.(png|jpe?g|webp)$'

# Gor sel tasiyan u st se viye dizinleri bul (thumbs ve tools haric)
$candidates = Get-ChildItem -Path $root -Directory | Where-Object {
  $_.Name -ne 'thumbs' -and $_.Name -ne 'tools' -and
  ((Get-ChildItem -Path $_.FullName -File -ErrorAction SilentlyContinue |
     Where-Object { $_.Extension -match $extRe }) | Measure-Object).Count -gt 0
}

foreach ($srcDir in $candidates) {
  $outDir = Join-Path $srcDir.FullName 'thumbs'
  if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }

  $files = Get-ChildItem -Path $srcDir.FullName -File |
    Where-Object { $_.Extension -match $extRe }
  $total = $files.Count
  $i = 0
  foreach ($f in $files) {
    $i++
    $outName = [System.IO.Path]::GetFileNameWithoutExtension($f.Name) + '.jpg'
    $outPath = Join-Path $outDir $outName
    if ((Test-Path $outPath) -and ((Get-Item $outPath).LastWriteTime -ge $f.LastWriteTime)) {
      continue
    }
    try {
      $srcImg = [System.Drawing.Image]::FromFile($f.FullName)
      $maxDim = 600
      $maxSide = [Math]::Max($srcImg.Width, $srcImg.Height)
      $scale = if ($maxSide -gt $maxDim) { $maxDim / $maxSide } else { 1.0 }
      $w = [int][Math]::Round($srcImg.Width * $scale)
      $h = [int][Math]::Round($srcImg.Height * $scale)
      $bmp = New-Object System.Drawing.Bitmap($w, $h)
      $g = [System.Drawing.Graphics]::FromImage($bmp)
      $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
      $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
      $g.DrawImage($srcImg, 0, 0, $w, $h)
      $enc = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
        Where-Object { $_.MimeType -eq 'image/jpeg' }
      $ep = New-Object System.Drawing.Imaging.EncoderParameters(1)
      $ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
        [System.Drawing.Imaging.Encoder]::Quality, 80L)
      $bmp.Save($outPath, $enc, $ep)
      $g.Dispose(); $bmp.Dispose(); $srcImg.Dispose()
      Write-Output "[$srcDir.Name|$i/$total] OK  $($f.Name)"
    } catch {
      Write-Output "[$srcDir.Name|$i/$total] SKIP $($f.Name) : $($_.Exception.Message)"
    }
  }
}
Write-Output 'Thumbnail uretimi tamam.'

# Sonuç özetini count.txt'e yaz (foreground komut çakışmalarından bağımsız doğrulama için)
$out = $null
foreach ($c in $candidates) {
  $tp = Join-Path $c.FullName 'thumbs'
  if (Test-Path $tp) { $out = $tp }
}
if ($out) {
  $tf = Get-ChildItem -Path $out -File -ErrorAction SilentlyContinue
  $sum = ($tf | Measure-Object Length -Sum).Sum
  $txt = 'Dir: ' + $out + "`r`n" +
         'Thumb files: ' + $tf.Count + "`r`n" +
         'Sum (MB): ' + [math]::Round($sum / 1MB, 2) + "`r`n" +
         'Avg (KB): ' + [math]::Round($sum / ([math]::Max($tf.Count, 1)) / 1KB, 1) + "`r`n"
  Set-Content -Path (Join-Path $root 'tools\count.txt') -Value $txt -Encoding utf8
}