## Méta-données (OBLIGATOIRE)
---
task_type: 'development'
migration_name: ''
---
id: "TASK-IAM-FE-003"
title: "Invite Member Form & Logic"
status: "planned"
priority: "P1"
labels: ["frontend"]
dependencies: ["TASK-IAM-FE-001", "TASK-IAM-FE-002"]
created: "2025-11-06"
---
### 1. High-Level Objective
Implémenter le formulaire d'invitation d'un nouveau membre, accessible depuis la page "Équipe", et gérer la logique de soumission (sans l'appel API réel).

### 2. Background / Context
Cette fonctionnalité est essentielle pour permettre aux administrateurs d'agrandir leur équipe.

### 3. Assumptions & Constraints
- **ASSUMPTION:** La logique de soumission sera mockée. L'appel API réel est géré dans une tâche séparée.

### 4. Dependencies
- **Tasks:** `TASK-IAM-FE-001`, `TASK-IAM-FE-002`
- **Files:** `components/ui/dialog.tsx`, `components/ui/input.tsx`, `components/ui/select.tsx`, `components/ui/toast.tsx`

### 5. Context Plan
- **BEGIN (add to model context):**
    - `app/(dashboard)/team/page.tsx`
    - `components/ui/dialog.tsx`
- **END STATE (must exist after completion):**
    - `app/(dashboard)/team/components/invite-member-dialog.tsx`
    - `app/(dashboard)/team/page.tsx` (modifié)

### 6. Low-Level Steps
1.  **CREATE** le composant `app/(dashboard)/team/components/invite-member-dialog.tsx`.
2.  **INTEGRATE** le `Dialog` et un formulaire (utilisant `react-hook-form` et `zod`) avec les champs `email` et `role`.
3.  **IMPLEMENT** la validation côté client pour s'assurer que l'email est valide et que le rôle est sélectionné.
4.  **MODIFY** `app/(dashboard)/team/page.tsx` pour que le bouton "Inviter un membre" ouvre `invite-member-dialog`.
5.  **MOCK** la logique de soumission pour afficher un `Toast` de succès ou d'erreur.

### 7. Acceptance Criteria
- [ ] Le clic sur "Inviter un membre" ouvre une modale avec le formulaire.
- [ ] Le formulaire valide correctement les entrées.
- [ ] La soumission (mockée) affiche une notification et ferme la modale en cas de succès.

### 8. Sécurité et Conformité Qualité
- [ ] **Validation des Entrées :** La validation de l'email et du rôle est implémentée côté client.
- [ ] **Gestion des Secrets :** N/A
- [ ] **Performance :** N/A
