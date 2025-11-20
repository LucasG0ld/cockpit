## Méta-données (OBLIGATOIRE)
Créer les pages d'erreur explicites pour les accès refusés (403 - Mauvaise Org/Rôle) et s'assurer que l'utilisateur n'est pas juste bloqué face à une page blanche ou un toast générique.

### 2. Background / Context
Amélioration de l'UX et de la sécurité (US-6). Un utilisateur qui tente d'accéder à une ressource interdite doit comprendre pourquoi (mauvaise organisation, rôle insuffisant).

### 3. Assumptions & Constraints
- **CONSTRAINT:** Utiliser le Design System (shadcn/ui) pour ces pages.
- **ASSUMPTION:** `api-client` peut intercepter les erreurs 401/403 globalement.

### 4. Dependencies
- **Tasks:** `TASK-IAM-FE-007-API-Integration`, `TASK-IAM-FE-007-A-UI-Permissions`
- **Files:** `lib/api-client.ts`

### 5. Context Plan
- **BEGIN (add to model context):**
    - `lib/api-client.ts`
    - `app/layout.tsx`
- **END STATE (must exist after completion):**
    - `apps/frontend/src/app/not-found.tsx`
    - `apps/frontend/src/app/forbidden/page.tsx` (ou `app/error.tsx` gérant le cas)
    - `lib/api-client.ts` (modifié)

### 6. Low-Level Steps
1.  **CREATE** `apps/frontend/src/app/not-found.tsx` : Page 404 stylisée avec lien retour Dashboard.
2.  **CREATE** `apps/frontend/src/app/forbidden/page.tsx` : Page 403 expliquant "Accès Refusé" (Vous n'avez pas les permissions nécessaires).
3.  **MODIFY** `lib/api-client.ts` (ou la configuration Axios/Query) : Ajouter un intercepteur de réponse.
    *   SI status === 403 : Rediriger vers `/forbidden` (ou afficher un Toast bloquant si c'est une action partielle).
    *   SI status === 401 : Rediriger vers `/sign-in` (normalement géré par Clerk, mais sécurité double).
4.  **TEST** en changeant manuellement son rôle ou en accédant à une URL interdite.

### 7. Acceptance Criteria
- [ ] Accéder à une URL inexistante affiche la page 404 custom.
- [ ] Une réponse API 403 redirige l'utilisateur vers la page Forbidden.
- [ ] Les pages respectent la charte graphique.

### 8. Sécurité et Conformité Qualité
- [ ] **Sécurité :** Ne pas afficher de détails techniques sensibles (stack trace) sur ces pages publiques/semi-publiques.
