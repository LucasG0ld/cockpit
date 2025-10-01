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

print_final_success() {
  echo ""
  echo "🎉🎉🎉=======================================================🎉🎉🎉"
  echo "🎉🎉🎉    QUALITY GATE PASSÉ AVEC SUCCÈS ! BRAVO !     🎉🎉🎉"
  echo "🎉🎉🎉=======================================================🎉🎉🎉"
}

print_step "1/4 - Lint"
npm run lint
print_success "Le code respecte les standards de style."

print_step "2/4 - Typecheck"
npm run typecheck
print_success "La structure des données est valide."

print_step "3/4 - Tests"
npm run test
print_success "Tous les tests sont verts."

print_step "4/4 - Build"
npm run build
print_success "Compilation réussie."

print_final_success


