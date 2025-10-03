$ErrorActionPreference = "Continue"

$global:QualityGateEntries = @()
$global:IsDiagnostic = $env:QUALITY_GATE_DIAG -eq '1'

function Add-Entry {
  param(
    [string]$Step,
    [string]$Type,
    [string]$Severity,
    [string]$Message,
    [string]$Action
  )

  $global:QualityGateEntries += [pscustomobject]@{
    Step     = $Step
    Type     = $Type
    Severity = $Severity
    Message  = $Message
    Action   = $Action
    Status   = 'non_corrected'
  }
}

function Detect-Severity {
  param([string]$Line)

  $normalized = $Line.ToLowerInvariant()
  $criticalPatterns = @('warning', 'warn', 'unsafe', 'deprecated', 'will stop working')

  foreach ($pattern in $criticalPatterns) {
    if ($normalized.Contains($pattern)) {
      return 'critical'
    }
  }

  return 'minor'
}

function Process-Output {
  param([string]$Step, [string]$Type, [string[]]$OutputLines)

  foreach ($line in $OutputLines) {
    if ([string]::IsNullOrWhiteSpace($line)) {
      continue
    }

    $severity = if ($Type -eq 'error') { 'critical' } else { Detect-Severity -Line $line }
    $action = if ($severity -eq 'critical') { 'fix' } else { 'keep' }
    Add-Entry -Step $Step -Type $Type -Severity $severity -Message $line.Trim() -Action $action
  }
}

function Run-Step {
  param([string]$Label, [string]$Command)

  Write-Host ""
  Write-Host "[STEP] $Label"

  $stepOutput = & cmd.exe /c $Command 2>&1
  $exitCode = $LASTEXITCODE

  if ($exitCode -ne 0) {
    Write-Host "[FAIL] $Label" -ForegroundColor Red
    Process-Output -Step $Label -Type 'error' -OutputLines $stepOutput
  } else {
    Write-Host "[OK] $Label"
    $warnings = $stepOutput | Where-Object { $_ -match '(?i)warning|warn|unsafe|deprecated|will stop working' }
    if ($warnings) {
      Process-Output -Step $Label -Type 'warning' -OutputLines $warnings
    }
  }
}

function Sanitize-TaskId {
  param([string]$Value)

  if ([string]::IsNullOrWhiteSpace($Value)) {
    return 'unknown-task'
  }

  $trimmed = $Value.Trim()
  $sanitized = $trimmed -replace '[^A-Za-z0-9-]', '-'
  return $sanitized.ToLowerInvariant()
}

function Resolve-TaskId {
  if ($env:QUALITY_GATE_TASK_ID) {
    return Sanitize-TaskId $env:QUALITY_GATE_TASK_ID
  }

  try {
    $branch = git rev-parse --abbrev-ref HEAD 2>$null
    if (-not [string]::IsNullOrWhiteSpace($branch)) {
      return Sanitize-TaskId $branch
    }
  } catch {
    # ignore
  }

  return 'unknown-task'
}

function Write-Report {
  param([string]$TaskId)

  $reportDir = "reports/quality-gate"
  if (-not (Test-Path $reportDir)) {
    New-Item -ItemType Directory -Path $reportDir | Out-Null
  }

  $reportPath = Join-Path $reportDir "$TaskId-quality-gate-report.md"

  $mode = if ($global:IsDiagnostic) { 'diagnostic' } else { 'enforcement' }

  $lines = @()
  $lines += "Mode: $mode"
  $lines += "| Step | Type | Severity | Action | Exact message | Status |"
  $lines += "|------|------|----------|--------|---------------|--------|"

  foreach ($entry in $global:QualityGateEntries) {
    $escapedMessage = $entry.Message.Replace('|', '\|')
    $lines += "| $($entry.Step) | $($entry.Type) | $($entry.Severity) | $($entry.Action) | $escapedMessage | $($entry.Status) |"
  }

  $lines | Set-Content -Encoding UTF8 $reportPath
  Write-Host "Report written to $reportPath"
}

function Print-Report {
  Write-Host ""
  $unresolvedCritical = $global:QualityGateEntries | Where-Object { $_.Severity -eq 'critical' }

  if ($global:IsDiagnostic) {
    Write-Host "=== QUALITY GATE DIAGNOSTIC COMPLETE ===" -ForegroundColor Yellow
  } else {
    if ($unresolvedCritical.Count -gt 0) {
      Write-Host "=== QUALITY GATE COMPLETED WITH ISSUES (FAILED) ===" -ForegroundColor Red
    } else {
      Write-Host "=== QUALITY GATE SUCCEEDED ===" -ForegroundColor Green
    }
  }

  if ($global:QualityGateEntries.Count -gt 0) {
    $table = $global:QualityGateEntries | Format-Table Step, Type, Severity, Action, Message, Status -AutoSize | Out-String
    Write-Host $table
  }
}

Run-Step "1/4 - Lint" "npm run lint"
Run-Step "2/4 - Typecheck" "npm run typecheck"
Run-Step "3/4 - Tests" "npm run test"
Run-Step "4/4 - Build" "npm run build"

$taskId = Resolve-TaskId
Write-Report -TaskId $taskId
Print-Report

if (-not $global:IsDiagnostic) {
  $unresolvedCritical = $global:QualityGateEntries | Where-Object { $_.Severity -eq 'critical' }
  if ($unresolvedCritical.Count -gt 0) {
    exit 1
  }
}
