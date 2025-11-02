# Template de Tâche Atomique (Version "Keystone")

## Méta-données (OBLIGATOIRE)
---
task_type: 'development'
migration_name: ''
---

id: "TASK-IAM-BE-002-Auth-Guard"
title: "Implémenter le guard NestJS HS256 Clerk multi-tenant"
status: "completed"
priority: "P0"
labels: ["backend", "types", "tests"]
dependencies: ["TASK-IAM-BE-001-DB-Schema"]
created: "2025-10-17"
---
### 1. High-Level Objective
Appliquer un guard global NestJS validant les JWT Clerk HS256 pour injecter `req.auth = {userId, orgId, role}` et refuser l'accès en 401/403 selon les critères du PRD.

### 2. Background / Context (Optionnel mais recommandé)
Le PRD impose une authentification forte et multi-tenant. Le guard doit contrôler la présence et la validité des claims `sub`, `orgId`, `role` et aligner les statuts HTTP (401/403) avec les scénarios décrits en US-1 et US-6.

### 3. Assumptions & Constraints
- **ASSUMPTION:** Les endpoints backend sont regroupés sous une même app NestJS (`apps/backend`).
- **CONSTRAINT:** Utiliser la lib Clerk officielle pour la vérification HS256 ou une implémentation custom validée par ADR-0006.

### 4. Dependencies (Autres Tâches ou Artefacts)
- **Tasks:** `TASK-IAM-BE-001-DB-Schema`
- **Files:** `annex/epic-1-iam/events.md`, `alpha-v1-context/5_PRD_Features_Alpha_v1/PRD_Features_Alpha_v1_IAM_Socle.md`

### 5. Context Plan
- **BEGIN (add to model context):**
    - `alpha-v1-context/5_PRD_Features_Alpha_v1/PRD_Features_Alpha_v1_IAM_Socle.md`
    - `apps/backend/src/app.module.ts`
    - `apps/backend/src/guards` (read-only si existant)
    - `apps/backend/src/main.ts`
    - `apps/backend/test/app.e2e-spec.ts`
- **END STATE (must exist after completion):**
    - `apps/backend/src/guards/clerk-auth.guard.ts`
    - `apps/backend/src/app.module.ts`
    - `apps/backend/test/app.e2e-spec.ts`

### 6. Low-Level Steps (Ordonnés et denses en information)
1. **INSTALL** dépendances Clerk nécessaires (ex: `@clerk/clerk-sdk-node` ou équivalent HS256).
2. **IMPLEMENT** `ClerkAuthGuard` vérifiant signature HS256 + claims (`sub`, `orgId`, `role`).
3. **BIND** le guard globalement via `APP_GUARD` et injecter `req.auth`.
4. **HANDLE** erreurs : 401 si claims manquants/invalides, 403 si `orgId` mismatch.
5. **TEST** via e2e pour couvrir 200/401/403 et ensure `req.auth` disponible.

### 7. Acceptance Criteria
- [ ] Les requêtes sans JWT valide renvoient 401 avec message cohérent.
- [ ] Les requêtes `orgId` mismatch renvoient 403.
- [ ] `req.auth` est peuplé et typé dans les handlers backend.
- [ ] Les tests e2e couvrent succès + refus (401/403).

### **8. Sécurité et Conformité Qualité**
- [ ] **Validation des Entrées :** Claims JWT vérifiés (format `org_<ulid>`, rôle dans l'enum).
- [ ] **Gestion des Secrets :** La clé Clerk HS256 est lue via variable d'environnement sécurisée.
- [ ] **Performance :** Le guard s'exécute en O(1) et ne fait pas d'I/O bloquantes supplémentaires.