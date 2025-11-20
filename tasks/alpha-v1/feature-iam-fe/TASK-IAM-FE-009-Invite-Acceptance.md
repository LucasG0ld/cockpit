## Méta-données (OBLIGATOIRE)
---
task_type: 'development'
migration_name: ''
---
id: "TASK-IAM-FE-009-Invite-Acceptance"
title: "Invitation Acceptance Page & Flow"
status: "planned"
priority: "P0"
labels: ["frontend", "auth", "public-page"]
dependencies: ["TASK-IAM-FE-007-API-Integration", "TASK-IAM-FE-008-Clerk-Integration-Fix"]
created: "2025-11-20"
---
### 1. High-Level Objective
Créer la page publique d'atterrissage pour les liens d'invitation qui valide le token et redirige l'utilisateur vers le flux d'inscription/connexion Clerk.

### 2. Background / Context
Cette tâche comble le vide identifié lors de l'audit (US-3). Actuellement, les liens d'invitation générés n'ont pas de destination fonctionnelle. Cette page est le point d'entrée critique pour les nouveaux membres.

### 3. Assumptions & Constraints
- **CONSTRAINT:** La page doit être publique (hors `(dashboard)` layout) et accessible sans authentification préalable.
- **ASSUMPTION:** L'API dispose d'un endpoint pour valider le token d'invitation et retourner l'email associé.

### 4. Dependencies
- **Tasks:** `TASK-IAM-FE-007-API-Integration`, `TASK-IAM-FE-008-Clerk-Integration-Fix`
- **Files:** `lib/api-client.ts`

### 5. Context Plan
- **BEGIN (add to model context):**
    - `lib/api-client.ts`
    - `apps/frontend/middleware.ts` (pour vérifier l'exclusion de la route)
- **END STATE (must exist after completion):**
    - `apps/frontend/src/app/(auth)/invite/accept/page.tsx`
    - `apps/frontend/src/app/(auth)/invite/accept/components/invite-loading.tsx` (Skeleton)
    - `apps/frontend/src/app/(auth)/invite/accept/components/invite-error.tsx`

### 6. Low-Level Steps
1.  **CREATE** le répertoire `apps/frontend/src/app/(auth)/invite/accept/`.
2.  **CREATE** la page `page.tsx` qui récupère le paramètre `token` de l'URL.
3.  **IMPLEMENT** un appel API (via `api-client`) dans un `useEffect` pour valider le token : `GET /invitations/validate?token=...`.
4.  **HANDLE** le cas de succès : Rediriger vers la page Sign-up Clerk (`/sign-up`) en passant l'email pré-rempli en paramètre (si supporté par Clerk) ou stocker l'email dans le `sessionStorage` pour l'UX.
5.  **HANDLE** les cas d'erreur : Afficher des messages explicites ("Lien expiré", "Déjà utilisé", "Invalide") avec un bouton pour contacter le support ou retourner à l'accueil.
6.  **VERIFY** que la route `/invite/accept` est bien exclue du `authMiddleware` dans `middleware.ts`.

### 7. Acceptance Criteria
- [ ] L'accès à `/invite/accept?token=xyz` est possible sans être connecté.
- [ ] Un token invalide affiche un message d'erreur clair.
- [ ] Un token valide redirige vers le flux d'inscription Clerk.
- [ ] L'utilisateur ne voit pas d'interface "cassée" pendant le chargement.

### 8. Sécurité et Conformité Qualité
- [ ] **Validation des Entrées :** Le token doit être présent avant de tenter l'appel API.
- [ ] **Performance :** L'appel de validation doit être rapide et ne pas bloquer le thread principal.
