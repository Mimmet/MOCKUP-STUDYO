$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent

# gor sel klasorunu bul (Turkce karakter guvenli)
$src = Get-ChildItem -LiteralPath $root -Directory |
  Where-Object { $_.Name -like 'g*sel' -and $_.Name -notlike '*thumb*' } |
  Select-Object -First 1
if (-not $src) { Write-Output 'GORSEL KLASORU YOK'; exit 1 }
$srcPath = $src.FullName
Write-Output ('KAYNAK: ' + $srcPath)

# Mevcut gallery listesi
$gd = Get-Content (Join-Path $root 'gallery-data.js') -Encoding UTF8 -Raw
$gdNames = [regex]::Matches($gd, "'((?:[^'\\]|\\.)*)'") | ForEach-Object { $_.Groups[1].Value } | Where-Object { $_ -and $_ -notlike '*GALLERY*' }
Write-Output ('MEVCUT GALLERY SAYISI: ' + $gdNames.Count)

# Klasordeki gorsel dosyalar (ust seviye, thumbs haric)
$files = Get-ChildItem -LiteralPath $srcPath -File -Recurse |
  Where-Object { $_.FullName -notlike '*\thumbs\*' -and $_.Extension -match '^\.(png|jpe?g|webp)$' }
Write-Output ('KLASORDEKI GORSEL DOSYASI: ' + $files.Count)

$existingNames = @{}
foreach ($n in $gdNames) { $existingNames[$n.ToLowerInvariant()] = $true }

$newFiles = $files | Where-Object { -not $existingNames.ContainsKey($_.Name.ToLowerInvariant()) }
Write-Output ('YENI (gallery icinde olmayan): ' + $newFiles.Count)

# Hash hesapla (yeni dosyalar + mevcut gallery dosyalari)
Write-Output 'HASH HESAPLANIYOR...'
$hashOf = @{}
foreach ($f in $files) {
  $h = (Get-FileHash -LiteralPath $f.FullName -Algorithm SHA256).Hash
  $hashOf[$f.FullName] = $h
}

# Yeni dosyalar arasinda ve mevcutlara karsi kopya kontrolu
$hashToNew = @{}
foreach ($nf in $newFiles) { $hashToNew[$nf.FullName] = $hashOf[$nf.FullName] }

# Map: hash -> mevcut dosya adi (ilk gorunen)
$hashToExisting = @{}
foreach ($f in $files) {
  if ($existingNames.ContainsKey($f.Name.ToLowerInvariant())) {
    if (-not $hashToExisting.ContainsKey($hashOf[$f.FullName])) {
      $hashToExisting[$hashOf[$f.FullName]] = $f.Name
    }
  }
}

Write-Output ''
Write-Output '=== 1) YENI DOSYALARIN KENDI ARASINDA KOPYA OLANLAR ==='
$seenNew = @{}
$selfDup = @()
$uniqueNew = @()
foreach ($nf in ($newFiles | Sort-Object Name)) {
  $h = $hashOf[$nf.FullName]
  if ($seenNew.ContainsKey($h)) {
    $selfDup += $nf.Name + '  (kopyasi: ' + $seenNew[$h] + ')'
  } else {
    $seenNew[$h] = $nf.Name
    $uniqueNew += $nf
  }
}
if ($selfDup.Count -eq 0) { Write-Output '  (yok - kendi arasinda kopya yok)' }
else { $selfDup | ForEach-Object { Write-Output ('  ' + $_) } }

Write-Output ''
Write-Output '=== 2) YENI DOSYALARIN MEVCUT GALERIDE KOPYASI OLANLAR ==='
$dupWithExisting = @()
$trulyNew = @()
foreach ($nf in ($uniqueNew | Sort-Object Name)) {
  $h = $hashOf[$nf.FullName]
  if ($hashToExisting.ContainsKey($h)) {
    $dupWithExisting += $nf.Name + '  (mevcut: ' + $hashToExisting[$h] + ')'
  } else {
    $trulyNew += $nf
  }
}
if ($dupWithExisting.Count -eq 0) { Write-Output '  (yok - mevcut galeriyle kopya yok)' }
else { $dupWithExisting | ForEach-Object { Write-Output ('  ' + $_) } }

Write-Output ''
Write-Output '=== SONUC OZETI ==='
Write-Output ('Toplam yeni dosya          : ' + $newFiles.Count)
Write-Output ('Kendi arasinda kopya      : ' + $selfDup.Count)
Write-Output ('Mevcutla kopya            : ' + $dupWithExisting.Count)
Write-Output ('GERCEKTEN EKLENECEK YENI  : ' + $trulyNew.Count)
Write-Output '--- EKLENECEK YENI DOSYALAR ---'
$trulyNew | Sort-Object Name | ForEach-Object { Write-Output ('  ' + $_.Name) }