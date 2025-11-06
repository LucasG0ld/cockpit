## Méta-données (OBLIGATOIRE)
---
task_type: 'development'
migration_name: ''
---
id: "TASK-IAM-FE-001"
title: "UI Components for Team Management"
status: "planned"
priority: "P0"
labels: ["frontend", "types"]
dependencies: []
created: "2025-11-06"
---
### 1. High-Level Objective
Créer la bibliothèque de composants React (shadcn/ui) de base, réutilisables et "dumb" (sans logique métier) qui seront nécessaires pour construire l'interface de gestion de l'équipe.

### 2. Background / Context
Cette tâche est la fondation de l'interface utilisateur du Jalon 2. Elle s'appuie sur shadcn/ui pour garantir la cohérence et l'accessibilité.

### 3. Assumptions & Constraints
- **CONSTRAINT:** Tous les composants doivent être basés sur la bibliothèque `shadcn/ui`.
- **CONSTRAINT:** Les composants doivent être testés via Storybook.

### 4. Dependencies
- **Files:** `f:\dev\cockpit\tailwind.config.js` (pour la configuration du thème)

### 5. Context Plan
- **END STATE (must exist after completion):**
    - `components/ui/button.tsx`
    - `components/ui/input.tsx`
    - `components/ui/label.tsx`
    - `components/ui/select.tsx`
    - `components/ui/dialog.tsx`
    - `components/ui/table.tsx`
    - `components/ui/dropdown-menu.tsx`
    - `components/ui/toast.tsx`
    - `components/ui/toaster.tsx`

### 6. Low-Level Steps
1.  **SETUP** Storybook pour le projet si non existant.
2.  **ADD** les composants `Button`, `Input`, `Label`, `Select`, `Dialog`, `Table`, `DropdownMenu`, `Toast`, `Toaster` via la CLI de `shadcn/ui`.
3.  **CREATE** des stories Storybook pour chaque composant afin de valider leur apparence et leurs variantes.

### 7. Acceptance Criteria
- [ ] Tous les composants listés dans `END STATE` sont créés.
- [ ] Chaque composant a une story correspondante dans Storybook.
- [ ] Le style est cohérent avec la charte graphique définie dans `tailwind.config.js`.

### 8. Sécurité et Conformité Qualité
- [ ] **Validation des Entrées :** N/A (composants présentationnels)
- [ ] **Gestion des Secrets :** N/A
- [ ] **Performance :** N/A
