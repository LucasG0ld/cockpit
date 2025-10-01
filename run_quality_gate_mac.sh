#!/bin/bash
# ============================================================================== 
# QUALITY GATE (macOS / Linux)
# ============================================================================== 

set -euo pipefail

ERRORS=()

print_step() {
  echo ""
  echo "🔵 ======================================================="
  echo "🔵 STEP: $1"
  echo "🔵 ======================================================="
}

record_error() {
  local message="$1"
  ERRORS+=("- $message")
}

print_report() {
  echo ""
  if [ ${#ERRORS[@]} -eq 0 ]; then
    echo "🎉🎉🎉=======================================================🎉🎉🎉"
    echo "🎉🎉🎉    QUALITY GATE PASSÉ AVEC SUCCÈS ! BRAVO !     🎉🎉🎉"
    echo "🎉🎉🎉=======================================================🎉🎉🎉"
  else
    echo "❌❌❌=======================================================❌❌❌"
    echo "❌❌❌        QUALITY GATE TERMINÉ AVEC ERREURS         ❌❌❌"
    echo "❌❌❌=======================================================❌❌❌"
    for err in "${ERRORS[@]}"; do
      echo "$err"
    done
  fi
}

run_step() {
  local label="$1"
  local command="$2"
  print_step "$label"
  if eval "$command"; then
    echo "✅  $label"
  else
    echo "❌  $label" >&2
    record_error "$label : voir logs ci-dessus"
  fi
}

run_step "1/4 - Lint" "npm run lint"
run_step "2/4 - Typecheck" "npm run typecheck"
run_step "3/4 - Tests" "npm run test"
run_step "4/4 - Build" "npm run build"

print_report

if [ ${#ERRORS[@]} -gt 0 ]; then
  exit 1
fi


