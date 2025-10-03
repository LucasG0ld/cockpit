### ADR-0007 - Quality Gate Diagnostic & Enforcement

-   **Date:** 2025-10-03
-   **Status:** Proposed
-   **Owner:** IA (Tech Lead)

---

#### 1. Context (Le Problème)
Le Quality Gate (lint/typecheck/test/build) signalait des erreurs mais ne faisait pas la différence entre un run de diagnostic (où l’on collecte les issues) et un run réussite. Cela compliquait la revue humaine et le suivi des corrections.

#### 2. Alternatives (Les Options Considérées)
-   **Option A :** Conserver un seul script qui échoue immédiatement (peu lisible pour l’opérateur).
-   **Option B :** Laisser les devs bricoler les logs et exécuter manuellement les sous-commandes.
-   **Option C :** Introduire deux modes (diagnostic/enforcement) avec rapport markdown et colonnes Action/Status.

#### 3. Decision (La Solution Choisie)
Nous retenons l’Option C : les scripts `run_quality_gate_win.ps1` et `run_quality_gate_mac.sh` détectent `QUALITY_GATE_DIAG=1` pour produire un rapport (« Diagnostic complete », exit 0) et classer chaque issue (`Action = fix/keep`). L’enforcement sans la variable échoue s’il reste des warnings critiques (`Action = fix`) et génère un rapport final succès/échec.

#### 4. Consequences (Les Impacts)
-   **Pros / Bénéfices :**
    -   Explicite pour la revue humaine (Phase 4A vs 4B).
    -   Rapport markdown versionné (`reports/quality-gate/…`) pour la traçabilité.
    -   Facilité à automatiser des checklists (Action = fix).
-   **Cons / Risques :**
    -   Nécessite de documenter l’utilisation de `QUALITY_GATE_DIAG`.
    -   Risque d’oublier de nettoyer la variable avant enforcement (gestion dans le workflow).
-   **Supersedes :** N/A

#### 5. Compliance / Verification (La Preuve)
-   Rapport diagnostic affichant `Mode: diagnostic` avec items `Action = fix`, puis rapport enforcement (`Mode: enforcement`) vide après corrections.
-   `npm run quality-gate:win` (et `QUALITY_GATE_DIAG=1 npm run quality-gate:mac`) montrent les sorties attendues.
-   **Artefacts Liés :**
    -   **Commit :** `[à renseigner]`
    -   **Test Log :** sorties Quality Gate (diagnostic + enforcement)