# Template de Tâche Atomique (Version "Keystone")

## Méta-données (OBLIGATOIRE)
---
task_type: 'development'
migration_name: 'iam-socle-schema'
---

id: "TASK-IAM-BE-001-DB-Schema"
title: "Aligner le schéma Prisma sur le modèle IAM socle"
status: "completed"
priority: "P0"
labels: ["backend", "migration", "types", "tests"]
dependencies: []
created: "2025-10-17"
---
### 1. High-Level Objective
Livrer un schéma Prisma et une migration Postgres conformes au modèle IAM socle (Organizations, Identities, Memberships, Invitations, AuditEvents) pour supporter les routes backend de l'épique 1.

### 2. Background / Context (Optionnel mais recommandé)
Le PRD IAM socle impose un modèle multi-tenant strict basé sur Identity/Membership et un audit trail. Le document `epic-1-iam.schema.md` décrit la source de vérité structurelle à traduire dans Prisma.

### 3. Assumptions & Constraints
- **ASSUMPTION:** Aucun autre service n'utilise encore ces tables; la migration peut créer des tables neuves.
- **CONSTRAINT:** Respecter la convention de suppression RESTRICT (pas de cascade) et les enums `UserRole`, `UserStatus`, `InvitationStatus` définis dans le schéma de référence.

### 4. Dependencies (Autres Tâches ou Artefacts)
- **Tasks:** `[]`
- **Files:** `annex/db-schema/epic-1-iam.schema.md`

### 5. Context Plan
- **BEGIN (add to model context):**
    - `annex/db-schema/epic-1-iam.schema.md`
    - `apps/backend/prisma/schema.prisma`
    - `apps/backend/package.json`
    - `apps/backend/prisma/migrations` (read-only)
- **END STATE (must exist after completion):**
    - `apps/backend/prisma/schema.prisma`
    - `apps/backend/prisma/migrations/202510171200_iam-socle-schema`
    - `apps/backend/generated/prisma/client`

### 6. Low-Level Steps (Ordonnés et denses en information)
1. **SYNC** Prisma enums/models avec `annex/db-schema/epic-1-iam.schema.md`, inclure relations et contraintes uniques.
2. **GENERATE** une migration `pnpm prisma migrate dev --name iam-socle-schema` depuis `apps/backend`.
3. **RUN** `pnpm prisma generate` pour rafraîchir le client dans `apps/backend/generated/prisma/client`.
4. **VALIDATE** la compilation backend (`pnpm build` ou `pnpm lint`) pour détecter les ruptures de type.

### 7. Acceptance Criteria
- [ ] `apps/backend/prisma/schema.prisma` reflète exactement les modèles/relations/enums du document de référence.
- [ ] La migration `iam-socle-schema` s'applique sans erreur sur une base vide (`pnpm prisma migrate dev`).
- [ ] Les types générés ne cassent ni lint ni build backend (`pnpm lint` + `pnpm build`).

### **8. Sécurité et Conformité Qualité**
- [ ] **Validation des Entrées :** Les contraintes Prisma couvrent unicité des emails, tokens et couples `(organizationId, identityId)`.
- [ ] **Gestion des Secrets :** `DATABASE_URL` reste injecté via l'environnement, aucun secret ajouté au code.
- [ ] **Performance :** Ajouter les index nécessaires (clé primaire, uniques) afin d'éviter les scans complets pour les accès critiques (membership par organisation).