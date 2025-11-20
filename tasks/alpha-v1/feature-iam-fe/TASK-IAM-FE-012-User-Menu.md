## Méta-données (OBLIGATOIRE)
---
task_type: 'development'
migration_name: ''
---
id: "TASK-IAM-FE-012-User-Menu"
title: "User Menu & Logout Integration"
status: "planned"
priority: "P1"
labels: ["frontend", "ux", "auth"]
dependencies: ["TASK-IAM-FE-008-Clerk-Integration-Fix"]
created: "2025-11-20"
---
### 1. High-Level Objective
Intégrer le composant de menu utilisateur (ou `<UserButton />` de Clerk) dans le layout principal pour permettre à l'utilisateur de consulter son profil et surtout de **se déconnecter**.

### 2. Background / Context
Manque basique identifié : l'utilisateur connecté ne peut actuellement pas se déconnecter proprement via l'UI.

### 3. Assumptions & Constraints
- **CONSTRAINT:** Utiliser le composant `<UserButton />` de Clerk si possible pour gagner du temps et gérer l'avatar/profil automatiquement.
- **CONSTRAINT:** Le menu doit être visible sur toutes les pages du Dashboard.

### 4. Dependencies
- **Tasks:** `TASK-IAM-FE-008-Clerk-Integration-Fix`
- **Files:** `app/(dashboard)/layout.tsx`

### 5. Context Plan
- **BEGIN (add to model context):**
    - `apps/frontend/src/app/(dashboard)/layout.tsx`
    - `apps/frontend/src/components/layout/header.tsx` (si existant, sinon à créer)
- **END STATE (must exist after completion):**
    - `apps/frontend/src/components/layout/user-nav.tsx` (Wrapper autour de UserButton)
    - `apps/frontend/src/app/(dashboard)/layout.tsx` (modifié pour inclure le Header/Nav)

### 6. Low-Level Steps
1.  **CHECK** si un composant Header existe. Sinon, le créer ou l'intégrer dans le Layout.
2.  **CREATE** `apps/frontend/src/components/layout/user-nav.tsx`.
3.  **IMPLEMENT** l'utilisation de `<UserButton afterSignOutUrl="/sign-in" />` de `@clerk/nextjs` à l'intérieur.
4.  **INTEGRATE** `UserNav` dans le coin supérieur droit du layout Dashboard.
5.  **VERIFY** que le bouton "Sign out" du menu Clerk fonctionne et redirige vers la page de connexion.

### 7. Acceptance Criteria
- [ ] L'avatar de l'utilisateur apparaît dans le layout.
- [ ] Le clic sur l'avatar ouvre un menu.
- [ ] Le menu contient l'option "Sign out".
- [ ] La déconnexion redirige vers `/sign-in`.

### 8. Sécurité et Conformité Qualité
- [ ] **Session :** La déconnexion doit bien invalider la session Clerk côté client.
