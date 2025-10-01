#!/bin/bash
# ============================================================================== 
# QUALITY GATE (macOS / Linux)
# ==============================================================================

set -euo pipefail

print_step() {
  echo ""
  echo "🔵 ======================================================="
  echo "🔵 STEP: $1"
  echo "🔵 ======================================================="
}

print_success() {
  echo "✅  $1"
}

print_failure() {
  echo "❌  $1" >&2
  exit 1
}

print_final_success() {
  echo ""
  echo "🎉🎉🎉=======================================================🎉🎉🎉"
  echo "🎉🎉🎉    QUALITY GATE PASSÉ AVEC SUCCÈS ! BRAVO !     🎉🎉🎉"
  echo "🎉🎉🎉=======================================================🎉🎉🎉"
}

run_step() {
  local label="$1"
  local command="$2"
  print_step "$label"
  if eval "$command"; then
    print_success "$label — OK"
  else
    print_failure "$label — ÉCHEC"
  fi
}

run_step "1/4 - Lint" "npm run lint"
run_step "2/4 - Typecheck" "npm run typecheck"
run_step "3/4 - Tests" "npm run test"
run_step "4/4 - Build" "npm run build"

print_final_success


