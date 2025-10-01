$ErrorActionPreference = "Continue"

$global:QualityGateErrors = @()

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
    $global:QualityGateErrors += "- $Label : $($_.Exception.Message)"
  }
}

function Print-Report {
  Write-Host ""
  if ($global:QualityGateErrors.Count -eq 0) {
    Write-Host "=== QUALITY GATE PASSED ==="
  }
  else {
    Write-Host "=== QUALITY GATE FAILED ===" -ForegroundColor Red
    Write-Host "" "Résumé des erreurs :"
    $global:QualityGateErrors | ForEach-Object { Write-Host $_ -ForegroundColor Red }
  }
}

Run-Step "1/4 - Lint" "npm run lint"
Run-Step "2/4 - Typecheck" "npm run typecheck"
Run-Step "3/4 - Tests" "npm run test"
Run-Step "4/4 - Build" "npm run build"

Print-Report

if ($global:QualityGateErrors.Count -gt 0) {
  exit 1
}


