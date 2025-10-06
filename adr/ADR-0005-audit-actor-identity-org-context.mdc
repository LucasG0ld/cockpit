### ADR-0005 - Audit: `actorId` = Identity, contexte d'organisation sur l'événement

-   **Date:** 2025-10-01
-   **Status:** Proposed
-   **Owner:** IA (Tech Lead)

---

#### 1. Context (Le Problème)
Avec le multi-org, l'acteur d'un événement doit être lié à l'identité globale (Identity), tout en conservant le contexte d'organisation de l'action.

#### 2. Alternatives (Les Options Considérées)
-   **Option A :** `actorId` = Membership.
-   **Option B :** `actorId` = Identity et stocker `organizationId` dans l'événement.
-   **Option C :** Stocker l'acteur dans `metadata`.

#### 3. Decision (La Solution Choisie)
Option B. `actorId` référence `Identity`. `organizationId` est un champ premier de l'événement. `metadata` peut inclure `membershipId` si utile.

#### 4. Consequences (Les Impacts)
-   **Pros / Bénéfices :** cohérence des audits transverses; simplification des jointures; clarté du scope.
-   **Cons / Risques :** nécessité d'ajouter `membershipId` en metadata quand l'action dépend d'une appartenance spécifique.
-   **Supersedes :** N/A

#### 5. Compliance / Verification (La Preuve)
-   Schéma: `AuditEvent.actorId` FK vers `Identity`; champ `organizationId` présent.
-   Tests: émissions `user.role.changed` et `user.status.changed` incluent `organizationId` et peuvent inclure `membershipId` dans `metadata`.
-   **Artefacts Liés :**
    -   **Commit :** [à renseigner]
    -   **Test Log :** [à renseigner]
