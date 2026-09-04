$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$root = Split-Path $PSScriptRoot -Parent
$srcDir = Join-Path $root 'gorsel'
# Klasor adi Turkce karakterli; dogrudan bul
$srcDir = Get-ChildItem -Path $root -Directory | Where-Object { $_.Name -like 'g*sel' -and $_.Name -notlike '*thumb*' -and $_.Name -notlike '*Kopya*' } | Select-Object -First 1
if (-not $srcDir) { Write-Output 'KLASOR YOK'; exit 1 }
$src = $srcDir.FullName
$dst = $srcDir.Name + '-thumb'
$dst = Join-Path $root $dst
if (-not (Test-Path $dst)) { New-Item -ItemType Directory -Path $dst | Out-Null }

# 1) Thumbnail uret (eksik olanlari)
$files = Get-ChildItem -Path $src -File | Where-Object { $_.Extension -match '\.(png|jpe?g|webp)$' }
$ok = 0; $skip = 0; $fail = 0
foreach ($f in $files) {
  $out = Join-Path $dst $f.Name
  if ((Test-Path $out) -and ((Get-Item $out).LastWriteTime -ge $f.LastWriteTime)) { $skip++; continue }
  try {
    $bmp = [System.Drawing.Bitmap]::FromFile($f.FullName)
    $maxSide = [Math]::Max($bmp.Width, $bmp.Height)
    $ratio = 300 / $maxSide
    if ($ratio -ge 1) { $ratio = 1.0 }
    $w = [int][Math]::Round($bmp.Width * $ratio); $h = [int][Math]::Round($bmp.Height * $ratio)
    if ($w -lt 1) { $w = 1 }; if ($h -lt 1) { $h = 1 }
    $thumb = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($thumb)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.DrawImage($bmp, 0, 0, $w, $h)
    $thumb.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $thumb.Dispose(); $bmp.Dispose()
    $ok++
  } catch { $fail++; Write-Output ("FAIL: " + $f.Name) }
}
Write-Output ("THUMB ok=" + $ok + " skip=" + $skip + " fail=" + $fail + " total=" + $files.Count)

# 2) main.js MANNEQUINS listesini klasorle senkronize et
$names = $files | ForEach-Object { $_.Name } | Sort-Object
$arr = ($names | ForEach-Object { "'" + ($_ -replace "'", "\'") + "'" }) -join ','
$mainPath = Join-Path $root 'main.js'
$js = [System.IO.File]::ReadAllText($mainPath, [System.Text.Encoding]::UTF8)
$pattern = "const MANNEQUINS = \[.*?\];"
$replacement = "const MANNEQUINS = [" + $arr + "];"
$js2 = [regex]::Replace($js, $pattern, $replacement, [System.Text.RegularExpressions.RegexOptions]::Singleline)
$enc = New-Object System.Text.UTF8Encoding($false)
[System.IO.File]::WriteAllText($mainPath, $js2, $enc)
Write-Output ("MANNEQUINS guncellendi: " + $names.Count + " gorsel")
