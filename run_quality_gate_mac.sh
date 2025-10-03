#!/bin/bash
# ============================================================================== 
# QUALITY GATE (macOS / Linux)
# ============================================================================== 

set -euo pipefail

QUALITY_GATE_LOG=()
IS_DIAG=${QUALITY_GATE_DIAG:-0}

print_step() {
  echo ""
  echo "[STEP] $1"
}

add_entry() {
  local step="$1"
  local type="$2"
  local severity="$3"
  local message="$4"
  local action="$5"
  QUALITY_GATE_LOG+=("$step|$type|$severity|$message|$action|non_corrected")
}

detect_severity() {
  local line="$1"
  local lowered="${line,,}"
  if [[ "$lowered" =~ warning || "$lowered" =~ warn || "$lowered" =~ unsafe || "$lowered" =~ deprecated || "$lowered" =~ "will stop working" ]]; then
    echo "critical"
  else
    echo "minor"
  fi
}

process_output() {
  local step="$1"
  local type="$2"
  local output="$3"
  while IFS= read -r line; do
    [[ -z "$line" ]] && continue
    local severity
    if [[ "$type" == "error" ]]; then
      severity="critical"
    else
      severity=$(detect_severity "$line")
    fi
    local action
    if [[ "$severity" == "critical" ]]; then
      action="fix"
    else
      action="keep"
    fi
    add_entry "$step" "$type" "$severity" "$line" "$action"
  done <<<"$output"
}

run_step() {
  local label="$1"
  local command="$2"
  print_step "$label"
  set +e
  local output
  output=$(eval "$command" 2>&1)
  local exit_code=$?
  set -e

  if [[ $exit_code -ne 0 ]]; then
    echo "[FAIL] $label"
    process_output "$label" "error" "$output"
  else
    echo "[OK] $label"
    local warnings
    warnings=$(echo "$output" | grep -iE 'warning|warn|unsafe|deprecated|will stop working' || true)
    if [[ -n "$warnings" ]]; then
      process_output "$label" "warning" "$warnings"
    fi
  fi
}

sanitize_task_id() {
  local value="$1"
  value=$(echo "$value" | tr '[:upper:]' '[:lower:]')
  value=${value//[^a-z0-9-]/-}
  echo "$value"
}

resolve_task_id() {
  if [[ -n "${QUALITY_GATE_TASK_ID:-}" ]]; then
    sanitize_task_id "${QUALITY_GATE_TASK_ID}"
    return
  fi

  local branch
  if branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null); then
    sanitize_task_id "$branch"
    return
  fi

  echo "unknown-task"
}

write_report() {
  local task_id="$1"
  local report_dir="reports/quality-gate"
  mkdir -p "$report_dir"
  local report_path="$report_dir/${task_id}-quality-gate-report.md"

  local mode="enforcement"
  if [[ "$IS_DIAG" == "1" ]]; then
    mode="diagnostic"
  fi

  {
    echo "Mode: $mode"
    echo "| Step | Type | Severity | Action | Exact message | Status |"
    echo "|------|------|----------|--------|---------------|--------|"
    for entry in "${QUALITY_GATE_LOG[@]}"; do
      IFS='|' read -r step type severity message action status <<<"$entry"
      message=${message//|/\|}
      echo "| $step | $type | $severity | $action | $message | $status |"
    done
  } >"$report_path"

  echo "Report written to $report_path"
}

print_report() {
  echo ""
  local unresolved
  unresolved=$(printf '%s\n' "${QUALITY_GATE_LOG[@]}" | grep '|critical|' || true)
  if [[ "$IS_DIAG" == "1" ]]; then
    echo "=== QUALITY GATE DIAGNOSTIC COMPLETE ==="
  else
    if [[ -n "$unresolved" ]]; then
      echo "=== QUALITY GATE COMPLETED WITH ISSUES (FAILED) ==="
    else
      echo "=== QUALITY GATE SUCCEEDED ==="
    fi
  fi

  if [[ ${#QUALITY_GATE_LOG[@]} -gt 0 ]]; then
    printf '%s\n' "${QUALITY_GATE_LOG[@]}" | while IFS='|' read -r step type severity message action status; do
      echo "- $step | $type | $severity | $action | $message | $status"
    done
  fi
}

run_step "1/4 - Lint" "npm run lint"
run_step "2/4 - Typecheck" "npm run typecheck"
run_step "3/4 - Tests" "npm run test"
run_step "4/4 - Build" "npm run build"

task_id=$(resolve_task_id)
write_report "$task_id"
print_report

if [[ "$IS_DIAG" != "1" ]]; then
  if printf '%s\n' "${QUALITY_GATE_LOG[@]}" | grep -q '|critical|'; then
    exit 1
  fi
fi


