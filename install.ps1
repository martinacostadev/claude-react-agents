# Claude React Agents Installation Script for Windows
# Usage: irm https://raw.githubusercontent.com/yourusername/claude-react-agents/main/install.ps1 | iex

$ErrorActionPreference = "Stop"

$RepoUrl = "https://github.com/yourusername/claude-react-agents"
$Branch = "main"

Write-Host @"
╔════════════════════════════════════════════╗
║     Claude React Agents Installer          ║
╚════════════════════════════════════════════╝

"@ -ForegroundColor Cyan

# Check if we're in a project directory
if (-not (Test-Path "package.json")) {
    Write-Host "⚠️  Warning: No package.json found. Are you in a project directory?" -ForegroundColor Yellow
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y") {
        exit 1
    }
}

# Check if .claude already exists
if (Test-Path ".claude") {
    Write-Host "⚠️  .claude directory already exists." -ForegroundColor Yellow
    $overwrite = Read-Host "Overwrite? (y/n)"
    if ($overwrite -ne "y") {
        Write-Host "Aborted."
        exit 1
    }
    Remove-Item -Recurse -Force ".claude"
}

Write-Host "📦 Downloading Claude React Agents..." -ForegroundColor Green

# Create temp directory
$TempDir = New-Item -ItemType Directory -Path ([System.IO.Path]::GetTempPath()) -Name ([System.Guid]::NewGuid().ToString())

try {
    # Download zip
    $ZipPath = Join-Path $TempDir "repo.zip"
    Invoke-WebRequest -Uri "$RepoUrl/archive/$Branch.zip" -OutFile $ZipPath

    # Extract
    Expand-Archive -Path $ZipPath -DestinationPath $TempDir -Force
    $ExtractedDir = Get-ChildItem -Path $TempDir -Directory | Where-Object { $_.Name -like "claude-react-agents*" } | Select-Object -First 1

    # Copy files
    Write-Host "📁 Installing configuration..." -ForegroundColor Green
    Copy-Item -Path (Join-Path $ExtractedDir.FullName ".claude") -Destination "." -Recurse -Force
    Copy-Item -Path (Join-Path $ExtractedDir.FullName "CLAUDE.md") -Destination "." -Force

    Write-Host ""
    Write-Host "✅ Installation complete!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Next steps:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "1. Install recommended skills:"
    Write-Host "   npx skills add vercel-labs/agent-skills"
    Write-Host "   npx skills add expo/skills"
    Write-Host ""
    Write-Host "2. (Optional) Copy local settings template:"
    Write-Host "   copy .claude\settings.local.json.example .claude\settings.local.json"
    Write-Host ""
    Write-Host "3. Start Claude Code and enjoy AI-assisted development!"
    Write-Host ""
}
finally {
    # Cleanup
    Remove-Item -Recurse -Force $TempDir -ErrorAction SilentlyContinue
}
