$ErrorActionPreference = "Stop"

function Run-Step {
  param([string]$Label, [string]$Command)
  Write-Host ""
  Write-Host "[STEP] $Label"
  try {
    Invoke-Expression $Command
    Write-Host "[OK] $Label"
  }
  catch {
    Write-Host "[FAIL] $Label" -ForegroundColor Red
    throw
  }
}

Run-Step "1/4 - Lint" "npm run lint"
Run-Step "2/4 - Typecheck" "npm run typecheck"
Run-Step "3/4 - Tests" "npm run test"
Run-Step "4/4 - Build" "npm run build"

Write-Host ""
Write-Host "=== QUALITY GATE PASSED ==="


