## Méta-données (OBLIGATOIRE)
---
task_type: 'development'
migration_name: ''
---
id: "TASK-IAM-FE-006-State-Management"
title: "State Management for Team & Audit"
status: "planned"
priority: "P1"
labels: ["frontend", "types"]
dependencies: []
created: "2025-11-06"
---
### 1. High-Level Objective
Mettre en place un store de gestion d'état (Zustand) pour gérer de manière centralisée les données de la page "Équipe" et du journal d'audit.

### 2. Background / Context
Une gestion d'état centralisée est cruciale pour éviter le 'prop drilling' et maintenir une architecture frontend saine et évolutive.

### 3. Assumptions & Constraints
- **CONSTRAINT:** La bibliothèque de gestion d'état sera `Zustand`.
- **ASSUMPTION:** Les appels API réels ne seront pas implémentés dans cette tâche, mais les actions correspondantes seront définies.

### 4. Dependencies
- **Files:** `package.json` (pour vérifier l'installation de Zustand)

### 5. Context Plan
- **END STATE (must exist after completion):**
    - `lib/store/team-store.ts`
    - `lib/store/audit-store.ts`

### 6. Low-Level Steps
1.  **INSTALL** `zustand` si ce n'est pas déjà fait (`npm install zustand`).
2.  **CREATE** le fichier `lib/store/team-store.ts` et définir le store avec un état initial (liste de membres, chargement, erreur) et les actions `fetchMembers`, `inviteMember`, `updateMember`.
3.  **CREATE** le fichier `lib/store/audit-store.ts` et définir le store avec un état initial et l'action `fetchAuditEvents`.
4.  **EXPORT** des hooks personnalisés (`useTeamStore`, `useAuditStore`) depuis chaque fichier de store.

### 7. Acceptance Criteria
- [ ] Les fichiers `team-store.ts` et `audit-store.ts` sont créés.
- [ ] Les stores contiennent les états et les actions définis.
- [ ] Les hooks personnalisés sont exportés et utilisables.

### 8. Sécurité et Conformité Qualité
- [ ] **Validation des Entrées :** N/A
- [ ] **Gestion des Secrets :** N/A
- [ ] **Performance :** N/A
