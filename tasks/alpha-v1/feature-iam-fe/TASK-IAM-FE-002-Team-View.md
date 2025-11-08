## Méta-données (OBLIGATOIRE)
---
task_type: 'development'
migration_name: ''
---
id: "TASK-IAM-FE-002-Team-View"
title: "Team View Page"
status: "completed"
priority: "P1"
labels: ["frontend"]
dependencies: ["TASK-IAM-FE-001"]
created: "2025-11-06"
---
### 1. High-Level Objective
Développer la page principale "Équipe" qui affiche la liste des membres de l'organisation en utilisant les composants de base.

### 2. Background / Context
Cette page est le hub central pour la gestion des membres de l'équipe. Elle doit être claire et fonctionnelle.

### 3. Assumptions & Constraints
- **ASSUMPTION:** Pour cette tâche, les données des membres seront mockées. L'intégration avec l'API est gérée dans une tâche séparée.

### 4. Dependencies
- **Tasks:** `TASK-IAM-FE-001`
- **Files:** `components/ui/table.tsx`, `components/ui/button.tsx`, `components/ui/dropdown-menu.tsx`

### 5. Context Plan
- **BEGIN (add to model context):**
    - `components/ui/table.tsx`
    - `components/ui/button.tsx`
    - `components/ui/dropdown-menu.tsx`
- **END STATE (must exist after completion):**
    - `app/(dashboard)/team/page.tsx`
    - `app/(dashboard)/team/components/team-table.tsx`

### 6. Low-Level Steps
1.  **CREATE** le fichier `app/(dashboard)/team/page.tsx`.
2.  **CREATE** le composant `app/(dashboard)/team/components/team-table.tsx`.
3.  **INTEGRATE** le composant `Table` dans `team-table.tsx` et définir les colonnes: `Email`, `Rôle`, `Statut`, `Actions`.
4.  **POPULATE** la table avec des données mockées pour simuler une liste de membres.
5.  **ADD** le `Button` "Inviter un membre" sur la page principale.
6.  **INTEGRATE** un `DropdownMenu` dans la colonne `Actions` de chaque ligne.

### 7. Acceptance Criteria
- [ ] La page `/team` affiche une table de membres mockés.
- [ ] Le bouton "Inviter un membre" est visible et cliquable (sans action pour l'instant).
- [ ] Chaque membre dans la table a un menu d'actions.

### 8. Sécurité et Conformité Qualité
- [ ] **Validation des Entrées :** N/A (données mockées)
- [ ] **Gestion des Secrets :** N/A
- [ ] **Performance :** N/A
