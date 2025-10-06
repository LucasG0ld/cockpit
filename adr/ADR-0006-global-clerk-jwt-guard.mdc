### ADR-0006 - Global Clerk JWT Guard

-   **Date:** 2025-10-03
-   **Status:** Proposed
-   **Owner:** IA (Tech Lead)

---

#### 1. Context (Le Problème)
Les endpoints backend doivent s’assurer qu’un utilisateur est authentifié via Clerk, possède un `orgId` cohérent et un rôle valide avant toute logique métier. Jusqu’ici, chaque handler gérait partiellement la validation des claims, ce qui entraînait des doublons et des risques (401/403 incohérents, absence de contexte partagé).

#### 2. Alternatives (Les Options Considérées)
-   **Option A :** Vérification locale des claims dans chaque controller/service.
-   **Option B :** Middleware Express personnalisé en amont de Nest.
-   **Option C :** Guard NestJS global (`APP_GUARD`) vérifiant le JWT, injectant un contexte partagé et utilisant un utilitaire `ensureOrgAccess`.

#### 3. Decision (La Solution Choisie)
Nous retenons l’Option C : un `JwtAuthGuard` global vérifie le JWT Clerk HS256 (`CLERK_JWT_SECRET`), valide `sub`, `orgId`, `role`, renvoie 401 en cas de claims manquants/invalides et 403 si `orgId` ≠ ressource. Le guard renseigne `req.auth = { userId, orgId, role }`, et les handlers utilisent `ensureOrgAccess` pour appliquer les 403.

#### 4. Consequences (Les Impacts)
-   **Pros / Bénéfices :**
    -   Alignement avec le PRD (401/403 centralisés).
    -   Logique mutualisée, réduction du code duplication.
    -   Tests unitaires/e2e plus simples (un seul point d’entrée).
-   **Cons / Risques :**
    -   Dépendance forte à la configuration Clerk (secret partagé).
    -   Toute route publique future devra explicitement bypasser le guard.
-   **Supersedes :** N/A

#### 5. Compliance / Verification (La Preuve)
-   Tests unitaires `app.controller.spec.ts` et e2e `auth.guard.e2e-spec.ts` valident 401/403 et les cas succès.
-   Rapport Quality Gate (reports/quality-gate/feature-task-iam-be-002-auth-guard-quality-gate-report.md) – enforcement = success.
-   **Artefacts Liés :**
    -   **Commit :** `[à renseigner]`
    -   **Test Log :** `pnpm --filter backend test:cov`, `pnpm --filter backend test:e2e`