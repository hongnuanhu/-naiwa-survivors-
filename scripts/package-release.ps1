$ErrorActionPreference = 'Stop'
$projectRoot = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
Push-Location $projectRoot
try {
    & npm.cmd run build
    if ($LASTEXITCODE -ne 0) { throw 'Build failed' }
    & node scripts/dependency-notices.mjs
    if ($LASTEXITCODE -ne 0) { throw 'License inventory failed' }
    $stagePath = [IO.Path]::GetFullPath((Join-Path $projectRoot '.release-stage'))
    if ($stagePath -ne (Join-Path $projectRoot '.release-stage')) { throw 'Unsafe staging path' }
    if (Test-Path -LiteralPath $stagePath) { Remove-Item -LiteralPath $stagePath -Recurse -Force }
    & node scripts/prepare-release.mjs
    if ($LASTEXITCODE -ne 0) { throw 'Release preparation failed' }
    $releasePath = Join-Path $projectRoot 'releases'
    New-Item -ItemType Directory -Path $releasePath -Force | Out-Null
    $checksums = @()
    foreach ($kind in @('source','runtime')) {
        $archivePath = Join-Path $releasePath "naiwa-survivors-$kind-0.1.0.zip"
        Compress-Archive -LiteralPath (Join-Path $stagePath "naiwa-survivors-$kind") -DestinationPath $archivePath -Force
        $sha256 = [Security.Cryptography.SHA256]::Create()
        try { $digest = [BitConverter]::ToString($sha256.ComputeHash([IO.File]::ReadAllBytes($archivePath))).Replace('-','').ToLowerInvariant() }
        finally { $sha256.Dispose() }
        $checksums += "$digest  $([IO.Path]::GetFileName($archivePath))"
        Write-Output $archivePath
    }
    [IO.File]::WriteAllLines((Join-Path $releasePath 'SHA256SUMS.txt'), $checksums)
} finally { Pop-Location }
