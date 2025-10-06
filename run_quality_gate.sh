#!/bin/bash
# ==============================================================================
# SCRIPT DU QUALITY GATE - CLIENTFLOW (ALPHA V1)
# ==============================================================================
#
# RÔLE :
# Ce script est le gardien automatisé de la qualité de notre code. Il exécute
# une série de vérifications critiques. Si une seule de ces étapes échoue,
# le script entier s'arrête avec un code d'erreur, bloquant ainsi
# la validation du nouveau code.
#
# USAGE :
# À exécuter depuis la racine du projet : ./run_quality_gate.sh
#
# PRÉREQUIS :
# `package.json` doit contenir les scripts suivants : `lint`, `typecheck`,
# `test`, et `build`.

# ------------------------------------------------------------------------------
# CONFIGURATION
# ------------------------------------------------------------------------------

# `set -e` est la commande la plus importante. Elle garantit que le script
# s'arrête immédiatement si une commande échoue.
set -e

# Fonctions pour des logs clairs et colorés
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


# ------------------------------------------------------------------------------
# EXÉCUTION DU QUALITY GATE
# ------------------------------------------------------------------------------

print_step "1/4 - VÉRIFICATION DE LA QUALITÉ DU CODE (LINTING)"
npm run lint
print_success "Le code respecte les standards de style."

print_step "2/4 - VÉRIFICATION DE LA COHÉRENCE DES DONNÉES (TYPESCRIPT)"
npm run typecheck
print_success "La structure des données (l'ADN du projet) est respectée."

print_step "3/4 - EXÉCUTION DES TESTS AUTOMATISÉS"
npm run test
print_success "Toutes les preuves (tests) sont valides."

print_step "4/4 - VÉRIFICATION FINALE DE LA COMPILATION"
npm run build
print_success "L'application se compile sans erreur."

print_final_success
