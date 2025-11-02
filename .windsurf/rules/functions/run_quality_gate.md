### Phase 4 : Validation Automatisée (Quality Gate)

**Instruction :** Prouve que ton travail est sûr en exécutant le script de Quality Gate. Ce script est configuré pour échouer et arrêter tout le processus (`set -e`/`$ErrorActionPreference = "Stop"`) si une seule étape de validation n'est pas respectée.

**Phase 4A – Diagnostic (analyse partagée avec l'humain)**
1.  Détecte ton OS :
    *   macOS / Linux : `QUALITY_GATE_DIAG=1 npm run quality-gate:mac`
    *   Windows : `powershell -NoProfile -Command "$Env:QUALITY_GATE_DIAG='1'; npm run quality-gate:win"`
2.  Exécute la commande diagnostic depuis la racine. Pour chaque étape (`lint`, `typecheck`, `test`, `build`) :
    *   consigne toute sortie en la classant en **erreur** ou **warning** ;
    *   évalue la gravité :
        - `critical` : erreurs ou warnings contenant “warning”, “warn”, “unsafe”, “deprecated”, ou annonçant une rupture proche (“will stop working in the next major version”, etc.) ;
        - `minor` : warnings informatifs non bloquants.
    *   en mode diagnostic, aucune correction n'est appliquée automatiquement ; le script se termine toujours avec succès.
3.  Partage le rapport markdown généré (`reports/quality-gate/<ID_TACHE>-quality-gate-report.md`) et les journaux bruts avec l'opérateur humain. Identifie clairement les entrées marquées `Action = fix` (erreurs + warnings `critical`) et celles en `Action = keep` (`minor`). Attends les instructions sur les corrections à effectuer.

**Phase 4B – Enforcement (corrections et validation finale)**
4.  Sur instruction humaine, repasse en mode enforcement :
    *   macOS / Linux : `npm run quality-gate:mac`
    *   Windows : `npm run quality-gate:win`
5.  Corrige **toutes les entrées `Action = fix`** (erreurs et warnings `critical`) puis relance la commande jusqu’à obtenir un run où :
    *   aucune erreur n’est présente ;
    *   aucun warning `critical` ne subsiste ;
    *   seuls des warnings `minor` éventuels restent consignés.
    Conserve tous les journaux (runs échoués et run final propre).
6.  Après le run propre, mets à jour le rapport markdown (même nom de fichier) avec les statuts `corrigé` / `non corrigé`, et joins-le en Phase 5.

**Note :** Assure-toi que ton terminal permet l'exécution des scripts et exporte les journaux complets (stdout/stderr) de chaque run ; range-les avec le rapport dans `reports/quality-gate/`.