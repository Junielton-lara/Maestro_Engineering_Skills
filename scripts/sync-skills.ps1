# Sync canonical skills/ -> .cursor/skills and .claude/skills
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

Write-Host "Done."
