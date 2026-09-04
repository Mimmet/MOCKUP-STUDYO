$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$src = Get-ChildItem -LiteralPath $root -Directory |
  Where-Object { $_.Name -like 'g*sel' -and $_.Name -notlike '*thumb*' } |
  Select-Object -First 1
$srcPath = $src.FullName

$gd = Get-Content (Join-Path $root 'gallery-data.js') -Encoding UTF8 -Raw
$names = [regex]::Matches($gd, "'((?:[^'\\]|\\.)*)'") | ForEach-Object { $_.Groups[1].Value } |
  Where-Object { $_ -and $_ -notlike '*GALLERY*' }

Write-Output ('GALLERY-DATA toplam giris: ' + $names.Count)
$lc = $names | ForEach-Object { $_.ToLowerInvariant() } | Group-Object | Where-Object { $_.Count -gt 1 }
Write-Output ('Dosya adi tekrari: ' + (@($lc).Count))
if ($lc) { $lc | ForEach-Object { Write-Output ('  DUP: ' + $_.Name + ' x' + $_.Count) } }

$missingFile = $names | Where-Object { -not (Test-Path -LiteralPath (Join-Path $srcPath $_)) }
Write-Output ('Diskte OLMAYAN gorsel: ' + (@($missingFile).Count))
if ($missingFile) { $missingFile | ForEach-Object { Write-Output ('  ' + $_) } }

$base = $names | ForEach-Object { [System.IO.Path]::GetFileNameWithoutExtension($_) }
$missingThumb = $base | Where-Object { -not (Test-Path -LiteralPath (Join-Path $srcPath ('thumbs\' + $_ + '.jpg'))) }
Write-Output ('Thumbnaili OLMAYAN: ' + (@($missingThumb).Count))
if ($missingThumb) { $missingThumb | ForEach-Object { Write-Output ('  ' + $_) } }

Write-Output 'Icerik bazli kopya taramasi...'
$hashToName = @{}
$contentDups = 0
foreach ($n in $names) {
  $p = Join-Path $srcPath $n
  if (-not (Test-Path -LiteralPath $p)) { continue }
  $h = (Get-FileHash -LiteralPath $p -Algorithm SHA256).Hash
  if ($hashToName.ContainsKey($h)) {
    $contentDups++
    Write-Output ('  ICERIK KOPYASI: ' + $n + '  <==>  ' + $hashToName[$h])
  } else { $hashToName[$h] = $n }
}
Write-Output ('Icerik bazli kopya cifti: ' + $contentDups)
Write-Output 'DOGRULAMA TAMAM'