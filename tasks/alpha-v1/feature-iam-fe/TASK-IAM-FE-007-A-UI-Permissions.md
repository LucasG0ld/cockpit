## Méta-données (OBLIGATOIRE)
---
task_type: 'development'
migration_name: ''
---
id: "TASK-IAM-FE-007-A-UI-Permissions"
title: "UI Permissions & Access Control"
status: "completed"
priority: "P1"
labels: ["frontend", "security"]
dependencies: ["TASK-IAM-FE-007"]
created: "2025-11-08"
---
### 1. High-Level Objective
Corriger la vulnérabilité de contrôle d'accès côté client en s'assurant que les actions sensibles (modifier le rôle, désactiver un membre) ne sont visibles et accessibles qu'aux utilisateurs disposant des permissions appropriées (ex: ADMIN).

### 2. Background / Context
Cette tâche fait suite à l'audit de sécurité de `TASK-IAM-FE-004` qui a révélé que les menus d'actions dans la table des membres étaient visibles par tous, indépendamment des droits de l'utilisateur. Cette tâche vise à corriger cette faille en utilisant le contexte de l'utilisateur authentifié.

### 3. Assumptions & Constraints
- **ASSUMPTION:** Le contexte de l'utilisateur authentifié (incluant son rôle) est disponible côté client suite à la complétion de `TASK-IAM-FE-007`.

### 4. Dependencies
- **Tasks:** `TASK-IAM-FE-007`
- **Files:** `app/(dashboard)/team/components/team-table.tsx`

### 5. Context Plan
- **BEGIN (add to model context):**
    - `app/(dashboard)/team/components/team-table.tsx`
- **END STATE (must exist after completion):**
    - `app/(dashboard)/team/components/team-table.tsx` (modifié)

### 6. Low-Level Steps
1.  **FETCH** le rôle de l'utilisateur actuellement connecté depuis le store d'authentification ou le contexte React.
2.  **MODIFY** le composant `app/(dashboard)/team/components/team-table.tsx`.
3.  **IMPLEMENT** un rendu conditionnel pour le `DropdownMenu` ou ses `DropdownMenuItem` afin que les actions d'administration ne soient rendues que si l'utilisateur connecté a le rôle `ADMIN`.

### 7. Acceptance Criteria
- [ ] Un utilisateur avec le rôle `MEMBER` ne voit pas les options "Edit role" et "Deactivate" dans le menu d'actions de la table des membres.
- [ ] Un utilisateur avec le rôle `ADMIN` voit et peut utiliser toutes les options du menu d'actions.

### 8. Sécurité et Conformité Qualité
- [ ] **Contrôle d'Accès :** Le but de cette tâche est de renforcer le contrôle d'accès côté client.
