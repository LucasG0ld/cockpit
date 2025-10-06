### ADR-0004 - Politique de suppression: RESTRICT (pas de cascade)

-   **Date:** 2025-10-01
-   **Status:** Proposed
-   **Owner:** IA (Tech Lead)

---

#### 1. Context (Le Problème)
Le PRD impose auditabilité et sécurité des données. Les suppressions en cascade peuvent provoquer des pertes non intentionnelles.

#### 2. Alternatives (Les Options Considérées)
-   **Option A :** CASCADE.
-   **Option B :** RESTRICT + procédures explicites d'archivage/purge.

#### 3. Decision (La Solution Choisie)
Option B. Interdire les cascades et documenter les procédures applicatives nécessaires avant suppression.

#### 4. Consequences (Les Impacts)
-   **Pros / Bénéfices :** prévention des pertes involontaires; traçabilité renforcée.
-   **Cons / Risques :** plus d'opérations manuelles/logiques avant suppression.
-   **Supersedes :** N/A

#### 5. Compliance / Verification (La Preuve)
-   Migrations: aucune contrainte CASCADE; tests tentant de supprimer une `Organization` avec dépendances doivent échouer.
-   **Artefacts Liés :**
    -   **Commit :** [à renseigner]
    -   **Test Log :** [à renseigner]
