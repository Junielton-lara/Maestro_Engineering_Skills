# Sync canonical skills/ and agents/ -> .cursor and .claude
# Usage: pwsh scripts/sync-skills.ps1

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$Source = Join-Path $Root "skills"
$Targets = @(
    (Join-Path $Root ".cursor\skills"),
    (Join-Path $Root ".claude\skills")
)

if (-not (Test-Path $Source)) {
    throw "Canonical skills folder not found: $Source"
}

$skillDirs = Get-ChildItem -Path $Source -Directory
if ($skillDirs.Count -eq 0) {
    throw "No skills found under $Source"
}

foreach ($target in $Targets) {
    New-Item -ItemType Directory -Force -Path $target | Out-Null
    foreach ($dir in $skillDirs) {
        $dest = Join-Path $target $dir.Name
        if (Test-Path $dest) {
            Remove-Item -Recurse -Force $dest
        }
        Copy-Item -Recurse -Force $dir.FullName $dest
    }
    Write-Host "Synced $($skillDirs.Count) skills -> $target"
}

$AgentsSource = Join-Path $Root "agents"
$AgentTargets = @(
    (Join-Path $Root ".cursor\agents"),
    (Join-Path $Root ".claude\agents")
)
$agentFiles = @(Get-ChildItem -Path $AgentsSource -Filter *.md -File -ErrorAction SilentlyContinue)
foreach ($target in $AgentTargets) {
    New-Item -ItemType Directory -Force -Path $target | Out-Null
    foreach ($file in $agentFiles) {
        Copy-Item -Force $file.FullName (Join-Path $target $file.Name)
    }
    Write-Host "Synced $($agentFiles.Count) agents -> $target"
}

Write-Host "Done."
