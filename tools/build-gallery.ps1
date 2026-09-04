# ============================================================
# build-gallery.ps1 — galeri manifest'i (gallery-data.js) uretir
# ve eksik thumbnail'leri olusturur.
# Kullanim: powershell -ExecutionPolicy Bypass -File tools\build-gallery.ps1
# Yeni gorsel ekledikten sonra tekrar calistirin.
# ============================================================
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent

# görsel klasörünü bul (Türkçe karakter güvenli: LiteralPath)
$src = Get-ChildItem -LiteralPath $root -Directory |
  Where-Object { $_.Name -like 'g*sel' -and $_.Name -notlike '*thumb*' } |
  Select-Object -First 1
if (-not $src) { Write-Output 'GORSEL KLASORU YOK'; exit 1 }
Write-Output ('Kaynak: ' + $src.FullName)

$files = Get-ChildItem -LiteralPath $src.FullName -File |
  Where-Object { $_.Extension -match '^\.(png|jpe?g|webp)$' } |
  Sort-Object Name
Write-Output ('Gorsel sayisi: ' + $files.Count)

# ---------- 1) Thumbnail uretimi (eksikler) ----------
Add-Type -AssemblyName System.Drawing
$thumbDir = Join-Path $src.FullName 'thumbs'
if (-not (Test-Path $thumbDir)) { New-Item -ItemType Directory -Path $thumbDir | Out-Null }
$made = 0; $skip = 0; $fail = 0
foreach ($f in $files) {
  $outName = [System.IO.Path]::GetFileNameWithoutExtension($f.Name) + '.jpg'
  $outPath = Join-Path $thumbDir $outName
  if ((Test-Path $outPath) -and ((Get-Item $outPath).LastWriteTime -ge $f.LastWriteTime)) { $skip++; continue }
  try {
    $img = [System.Drawing.Image]::FromFile($f.FullName)
    $maxSide = [Math]::Max($img.Width, $img.Height)
    $scale = if ($maxSide -gt 600) { 600 / $maxSide } else { 1.0 }
    $w = [int][Math]::Round($img.Width * $scale)
    $h = [int][Math]::Round($img.Height * $scale)
    if ($w -lt 1) { $w = 1 }
    if ($h -lt 1) { $h = 1 }
    $bmp = New-Object System.Drawing.Bitmap($w, $h)
    $g2 = [System.Drawing.Graphics]::FromImage($bmp)
    $g2.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g2.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g2.DrawImage($img, 0, 0, $w, $h)
    $enc = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
      Where-Object { $_.MimeType -eq 'image/jpeg' }
    $ep = New-Object System.Drawing.Imaging.EncoderParameters(1)
    $ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
      [System.Drawing.Imaging.Encoder]::Quality, 80L)
    $bmp.Save($outPath, $enc, $ep)
    $g2.Dispose(); $bmp.Dispose(); $img.Dispose()
    $made++
  } catch { $fail++; Write-Output ('THUMB FAIL: ' + $f.Name) }
}
Write-Output ('Thumb uretildi: ' + $made + ' | atlandi: ' + $skip + ' | hata: ' + $fail)

# ---------- 2) gallery-data.js ----------
$names = $files | ForEach-Object { $_.Name }
$arr = ($names | ForEach-Object { "'" + ($_ -replace "\\", "\\\\" -replace "'", "\'") + "'" }) -join ",`n  "
$js = "/* gallery-data.js - tools/build-gallery.ps1 tarafindan uretilir.`n" +
      "   Yeni gorsel ekledikten sonra tekrar calistirin:`n" +
      "   powershell -ExecutionPolicy Bypass -File tools\build-gallery.ps1 */`n" +
      "window.GALLERY_FILES = [`n  " + $arr + "`n];`n"
[System.IO.File]::WriteAllText((Join-Path $root 'gallery-data.js'), $js, (New-Object System.Text.UTF8Encoding($false)))
Write-Output ('gallery-data.js yazildi: ' + $names.Count + ' gorsel')
