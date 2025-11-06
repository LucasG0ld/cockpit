## Méta-données (OBLIGATOIRE)
---
task_type: 'development'
migration_name: ''
---
id: "TASK-IAM-FE-007"
title: "API Integration"
status: "planned"
priority: "P0"
labels: ["frontend"]
dependencies: ["TASK-IAM-FE-002", "TASK-IAM-FE-003", "TASK-IAM-FE-004", "TASK-IAM-FE-005", "TASK-IAM-FE-006"]
created: "2025-11-06"
---
### 1. High-Level Objective
Connecter l'ensemble des fonctionnalités frontend (gestion de l'équipe et journal d'audit) aux endpoints de l'API backend en remplaçant toutes les données et logiques mockées par de vrais appels réseau.

### 2. Background / Context
Cette tâche est l'étape finale pour rendre le Jalon 2 entièrement fonctionnel. Elle rassemble tous les composants UI et la gestion d'état pour les connecter au backend.

### 3. Assumptions & Constraints
- **ASSUMPTION:** Les endpoints de l'API backend (Jalon 1) sont déployés, fonctionnels et documentés.
- **CONSTRAINT:** Le token d'authentification (JWT) doit être récupéré depuis Clerk et inclus dans chaque requête API.

### 4. Dependencies
- **Tasks:** `TASK-IAM-FE-002`, `TASK-IAM-FE-003`, `TASK-IAM-FE-004`, `TASK-IAM-FE-005`, `TASK-IAM-FE-006`
- **Files:** `lib/store/team-store.ts`, `lib/store/audit-store.ts`

### 5. Context Plan
- **BEGIN (add to model context):**
    - `lib/store/team-store.ts`
    - `lib/store/audit-store.ts`
    - `app/(dashboard)/team/page.tsx`
    - `app/(dashboard)/audit/page.tsx`
- **END STATE (must exist after completion):**
    - `lib/api-client.ts` (créé)
    - `lib/store/team-store.ts` (modifié)
    - `lib/store/audit-store.ts` (modifié)

### 6. Low-Level Steps
1.  **CREATE** un client API dans `lib/api-client.ts` (ex: avec axios) qui inclut automatiquement le token d'authentification dans les headers.
2.  **MODIFY** `lib/store/team-store.ts` pour remplacer les mocks par des appels API via le client pour les actions `fetchMembers`, `inviteMember`, et `updateMember`.
3.  **MODIFY** `lib/store/audit-store.ts` pour implémenter l'appel API pour `fetchAuditEvents`.
4.  **UPDATE** les composants React pour gérer les états de chargement et d'erreur exposés par les stores Zustand.
5.  **TEST** le flux E2E complet : inviter, modifier, désactiver un membre et vérifier que les changements sont persistés et que les logs d'audit sont créés.

### 7. Acceptance Criteria
- [ ] La page "Équipe" affiche les données provenant de l'API.
- [ ] Toutes les actions (inviter, modifier rôle/statut) fonctionnent et mettent à jour l'UI après confirmation de l'API.
- [ ] La page "Audit" affiche les événements réels de l'API.
- [ ] Les états de chargement et les erreurs sont correctement affichés à l'utilisateur.

### 8. Sécurité et Conformité Qualité
- [ ] **Validation des Entrées :** N/A (géré par le backend).
- [ ] **Gestion des Secrets :** L'URL de base de l'API doit provenir des variables d'environnement.
- [ ] **Performance :** S'assurer que les appels API ne sont pas effectués de manière excessive (ex: dans une boucle de rendu).
