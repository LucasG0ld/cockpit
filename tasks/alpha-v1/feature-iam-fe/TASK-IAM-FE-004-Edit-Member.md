## Méta-données (OBLIGATOIRE)
---
task_type: 'development'
migration_name: ''
---
id: "TASK-IAM-FE-004"
title: "Edit Member Logic"
status: "planned"
priority: "P1"
labels: ["frontend"]
dependencies: ["TASK-IAM-FE-001", "TASK-IAM-FE-002"]
created: "2025-11-06"
---
### 1. High-Level Objective
Implémenter la logique de modification du rôle et du statut d'un membre existant via le menu d'actions de la table des membres.

### 2. Background / Context
Cette fonctionnalité permet aux administrateurs de gérer le cycle de vie des membres de leur équipe.

### 3. Assumptions & Constraints
- **ASSUMPTION:** Les actions de modification seront mockées. L'intégration API est gérée dans une tâche séparée.

### 4. Dependencies
- **Tasks:** `TASK-IAM-FE-001`, `TASK-IAM-FE-002`
- **Files:** `app/(dashboard)/team/components/team-table.tsx`, `components/ui/dialog.tsx`, `components/ui/select.tsx`

### 5. Context Plan
- **BEGIN (add to model context):**
    - `app/(dashboard)/team/components/team-table.tsx`
- **END STATE (must exist after completion):**
    - `app/(dashboard)/team/components/edit-role-dialog.tsx`
    - `app/(dashboard)/team/components/toggle-status-dialog.tsx`
    - `app/(dashboard)/team/components/team-table.tsx` (modifié)

### 6. Low-Level Steps
1.  **CREATE** le composant `app/(dashboard)/team/components/edit-role-dialog.tsx`.
2.  **CREATE** le composant `app/(dashboard)/team/components/toggle-status-dialog.tsx`.
3.  **MODIFY** `app/(dashboard)/team/components/team-table.tsx` pour que les options du `DropdownMenu` ouvrent les modales correspondantes.
4.  **IMPLEMENT** la logique de changement de rôle (mockée) dans `edit-role-dialog.tsx`.
5.  **IMPLEMENT** la logique de changement de statut (mockée) dans `toggle-status-dialog.tsx`.
6.  **IMPLEMENT** le rendu conditionnel de l'option "Désactiver"/"Réactiver" dans le `DropdownMenu`.

### 7. Acceptance Criteria
- [ ] Le clic sur "Modifier le rôle" ouvre une modale pour changer le rôle.
- [ ] Le clic sur "Désactiver"/"Réactiver" ouvre une modale de confirmation.
- [ ] Les actions (mockées) mettent à jour l'état de la table.

### 8. Sécurité et Conformité Qualité
- [ ] **Validation des Entrées :** N/A
- [ ] **Gestion des Secrets :** N/A
- [ ] **Performance :** N/A
