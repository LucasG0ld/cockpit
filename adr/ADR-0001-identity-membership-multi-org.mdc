### ADR-0001 - Modèle Identity/Membership multi-organisation

-   **Date:** 2025-10-01
-   **Status:** Proposed
-   **Owner:** IA (Tech Lead)

---

#### 1. Context (Le Problème)
Une même personne (email/clerkId) doit pouvoir appartenir à plusieurs organisations avec des rôles et statuts distincts. Le modèle précédent liait `User` 1:1 à `Organization` et imposait `email @unique` globalement, ce qui empêche le multi-org.

#### 2. Alternatives (Les Options Considérées)
-   **Option A :** Conserver `User` lié à `Organization` avec `email @unique` global et dupliquer l'utilisateur par org.
-   **Option B :** Introduire `Identity` (unique `clerkId`/`email`) et `Membership` (n..m) portant `role` et `status` par organisation.
-   **Option C :** Utiliser un mapping externe (table pivot implicite) sans structurer les rôles/statuts par org.

#### 3. Decision (La Solution Choisie)
Option B. Créer `Identity` (identité globale) et `Membership` (appartenance à une `Organization`), avec `@@unique([organizationId, identityId])`. Les champs `role`, `status`, `disabledAt` résident sur `Membership`.

#### 4. Consequences (Les Impacts)
-   **Pros / Bénéfices :**
    -   Support multi-organisation natif.
    -   Rôles/statuts par organisation, cohérent avec le PRD.
    -   Invitations et audits plus explicites.
-   **Cons / Risques :**
    -   Complexité accrue dans les services et requêtes.
    -   Nécessite une migration et adaptation des endpoints/DTOs.
-   **Supersedes :** N/A

#### 5. Compliance / Verification (La Preuve)
-   Prisma contient `Identity`, `Membership` et contrainte `@@unique([organizationId, identityId])`.
-   Les endpoints Invitations/Role/Status manipulent des `membershipId` et/ou mappent `identityId` + `organizationId`.
-   **Artefacts Liés :**
    -   **Commit :** [à renseigner]
    -   **Test Log :** [à renseigner]
