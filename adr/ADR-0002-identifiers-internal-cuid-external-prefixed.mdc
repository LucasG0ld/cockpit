### ADR-0002 - Identifiants: cuid internes + identifiants externes préfixés (JWT)

-   **Date:** 2025-10-01
-   **Status:** Proposed
-   **Owner:** IA (Tech Lead)

---

#### 1. Context (Le Problème)
Le PRD impose des identifiants préfixés dans les JWT (`org_<ulid>`). La base de données doit conserver des identifiants internes stables et indépendants du format exposé.

#### 2. Alternatives (Les Options Considérées)
-   **Option A :** Stocker directement des `ulid` préfixés dans la DB.
-   **Option B :** Conserver des `cuid` internes et ajouter des colonnes `externalId` uniques pour les entités exposées.
-   **Option C :** Mapper à la volée sans persister d'`externalId` (risque de lookup coûteux/fragile).

#### 3. Decision (La Solution Choisie)
Option B. Ajouter `Organization.externalId @unique` pour correspondre aux claims, tout en gardant `id` en `cuid`. Le backend mappe entre `externalId` (JWT) et `id` (DB).

#### 4. Consequences (Les Impacts)
-   **Pros / Bénéfices :** séparation claire interne/externe; stabilité des PK; compatibilité future.
-   **Cons / Risques :** nécessité de synchroniser/valider l'unicité des `externalId` et de maintenir le mapping dans les guards/services.
-   **Supersedes :** N/A

#### 5. Compliance / Verification (La Preuve)
-   Schéma: `Organization.externalId @unique` présent.
-   Guard JWT: résolution `orgId(externe)` → `Organization.id` utilisée dans toutes les requêtes scoppées.
-   **Artefacts Liés :**
    -   **Commit :** [à renseigner]
    -   **Test Log :** [à renseigner]
