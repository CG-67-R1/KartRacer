# Copy KartRacer Hermes skills from repo into %LOCALAPPDATA%\hermes\skills\kart-racer\
# Usage: .\scripts\install-hermes-skills.ps1

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoRoot = Split-Path -Parent $ScriptDir
$Source = Join-Path $RepoRoot "docs\hermes\skills\kart-racer"
$Dest = Join-Path $env:LOCALAPPDATA "hermes\skills\kart-racer"

if (-not (Test-Path $Source)) {
  Write-Error "Source not found: $Source"
}

New-Item -ItemType Directory -Force -Path $Dest | Out-Null
Copy-Item -Path (Join-Path $Source "*") -Destination $Dest -Recurse -Force

Write-Host "Installed Hermes skills to $Dest"
Get-ChildItem $Dest -Directory | ForEach-Object { Write-Host "  - kart-racer/$($_.Name)" }
