## Méta-données (OBLIGATOIRE)
---
task_type: 'development'
migration_name: ''
---
id: "TASK-IAM-FE-010-Reassignment-Flow"
title: "Resource Reassignment Modal & Logic"
status: "planned"
priority: "P1"
labels: ["frontend", "business-logic"]
dependencies: ["TASK-IAM-FE-004-Edit-Member", "TASK-IAM-FE-007-API-Integration"]
created: "2025-11-20"
---
### 1. High-Level Objective
Implémenter le flux bloquant lors de la désactivation d'un CSM ou d'un changement de rôle critique, forçant l'Admin à réassigner les clients actifs avant de valider l'action.

### 2. Background / Context
Nécessaire pour respecter les règles métiers de continuité de service (US-4, US-5). Un CSM ne peut pas "disparaître" en laissant des clients orphelins.

### 3. Assumptions & Constraints
- **ASSUMPTION:** L'API retourne une erreur spécifique (ex: 409 Conflict avec metadata) ou un flag `hasActiveClients` lors de la tentative de désactivation, ou bien une route de pré-vérification existe.
- **CONSTRAINT:** L'UX doit être fluide : ne pas laisser l'Admin deviner pourquoi l'action échoue.

### 4. Dependencies
- **Tasks:** `TASK-IAM-FE-004-Edit-Member`, `TASK-IAM-FE-007-API-Integration`
- **Files:** `app/(dashboard)/team/components/team-table.tsx`

### 5. Context Plan
- **BEGIN (add to model context):**
    - `app/(dashboard)/team/components/team-table.tsx`
    - `lib/store/team-store.ts`
- **END STATE (must exist after completion):**
    - `app/(dashboard)/team/components/reassign-clients-dialog.tsx`
    - `app/(dashboard)/team/components/team-table.tsx` (modifié)

### 6. Low-Level Steps
1.  **CREATE** le composant `reassign-clients-dialog.tsx` : une modale qui liste le nombre de clients impactés et propose un `Select` pour choisir un nouveau CSM (filtré par rôle).
2.  **MODIFY** la logique de "Désactiver" dans `team-table.tsx` (ou le store) :
    *   Avant d'appeler l'API de désactivation, vérifier si le membre a des clients actifs (soit par un champ dans l'objet membre, soit par un appel API de "dry-run").
    *   SI clients actifs > 0 : Ouvrir `ReassignClientsDialog` au lieu de la confirmation simple.
3.  **IMPLEMENT** la soumission dans la modale : Appeler l'endpoint de "Transfert & Désactivation" (ou deux appels séquentiels si l'API le requiert : Transfert PUIS Désactivation).
4.  **HANDLE** les erreurs API lors du transfert.

### 7. Acceptance Criteria
- [ ] Tenter de désactiver un CSM avec des clients ouvre la modale de réassignation.
- [ ] La modale empêche la validation tant qu'un repreneur n'est pas choisi.
- [ ] La désactivation réussit une fois le transfert effectué.
- [ ] La désactivation d'un membre sans client reste un flux simple (confirmation standard).

### 8. Sécurité et Conformité Qualité
- [ ] **Intégrité des Données :** Aucun client ne doit se retrouver sans Owner (NULL) à la fin de l'opération.
