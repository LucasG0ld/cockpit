### ADR-0003 - Purge PII J+14 basée sur Membership.disabledAt

-   **Date:** 2025-10-01
-   **Status:** Proposed
-   **Owner:** IA (Tech Lead)

---

#### 1. Context (Le Problème)
Le PRD requiert la purge des PII J+14 après désactivation tout en conservant audit et pièces légales. La désactivation doit être scopée à l'organisation.

#### 2. Alternatives (Les Options Considérées)
-   **Option A :** Champ global `disabledAt` sur l'Identity.
-   **Option B :** Champ `disabledAt` sur la Membership (scopée à l'org).
-   **Option C :** Gestion hors base via journaux applicatifs.

#### 3. Decision (La Solution Choisie)
Option B. Ajouter `Membership.disabledAt` et un job planifié qui purge les PII associées à la Membership après J+14, sans affecter les autres organisations où l'Identity reste active.

#### 4. Consequences (Les Impacts)
-   **Pros / Bénéfices :** respect du scope org; granularité; auditabilité.
-   **Cons / Risques :** nécessite un scheduler fiable et une liste précise des PII à purger.
-   **Supersedes :** N/A

#### 5. Compliance / Verification (La Preuve)
-   Schéma: `Membership.disabledAt` présent.
-   Job: tests e2e vérifient la purge uniquement après J+14 et uniquement pour les memberships désactivées.
-   **Artefacts Liés :**
    -   **Commit :** [à renseigner]
    -   **Test Log :** [à renseigner]
