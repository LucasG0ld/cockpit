$ErrorActionPreference = "Stop"

function Print-Step($message) {
  Write-Host ""
  Write-Host "🔵 ======================================================="
  Write-Host "🔵 STEP: $message"
  Write-Host "🔵 ======================================================="
}

function Print-Success($message) {
  Write-Host "✅  $message"
}

function Print-FinalSuccess() {
  Write-Host ""
  Write-Host "🎉🎉🎉=======================================================🎉🎉🎉"
  Write-Host "🎉🎉🎉    QUALITY GATE PASSÉ AVEC SUCCÈS ! BRAVO !     🎉🎉🎉"
  Write-Host "🎉🎉🎉=======================================================🎉🎉🎉"
}

Print-Step "1/4 - Lint"
Invoke-Expression "npm run lint"
Print-Success "Le code respecte les standards de style."

Print-Step "2/4 - Typecheck"
Invoke-Expression "npm run typecheck"
Print-Success "La structure des données est valide."

Print-Step "3/4 - Tests"
Invoke-Expression "npm run test"
Print-Success "Tous les tests sont verts."

Print-Step "4/4 - Build"
Invoke-Expression "npm run build"
Print-Success "Compilation réussie."

Print-FinalSuccess


