# TASK-IAM-FE-007: API Integration

**Epic:** [epic-1-iam](../annex/epic-1-iam/_plan.md)
**Jalon:** 2 - Team Management UI
**Dépend de:**
* [TASK-IAM-FE-002-Team-View](./TASK-IAM-FE-002-Team-View.md)
* [TASK-IAM-FE-003-Invite-Member](./TASK-IAM-FE-003-Invite-Member.md)
* [TASK-IAM-FE-004-Edit-Member](./TASK-IAM-FE-004-Edit-Member.md)
* [TASK-IAM-FE-005-Audit-Trail](./TASK-IAM-FE-005-Audit-Trail.md)
* [TASK-IAM-FE-006-State-Management](./TASK-IAM-FE-006-State-Management.md)
**Statut:** To Do

---

### Objectif

Connecter l'ensemble des fonctionnalités frontend (gestion de l'équipe et journal d'audit) aux endpoints de l'API backend en remplaçant toutes les données et logiques mockées par de vrais appels réseau.

### Low-Level Steps

1.  **API Client Setup**:
    *   Configurer un client API (ex: `axios` ou `fetch` wrapper) pour gérer les requêtes HTTP, y compris l'envoi du token d'authentification dans les headers.

2.  **Integrate Team Management**:
    *   Dans le `teamStore`, implémenter les vrais appels API pour les actions `fetchMembers`, `inviteMember`, et `updateMember`.
    *   Connecter les composants (`team-table`, `invite-member-dialog`, etc.) au `teamStore` pour afficher les données réelles et déclencher les actions.
    *   Gérer les états de chargement (`loading`) et les erreurs (`error`) dans l'UI.

3.  **Integrate Audit Trail**:
    *   Dans le `auditStore`, implémenter l'appel API pour `fetchAuditEvents`.
    *   Connecter la page `audit` au `auditStore` pour afficher les données réelles.

4.  **End-to-End Testing**:
    *   Tester le flux complet : inviter un membre, le voir apparaître dans la liste, changer son rôle, le désactiver, et voir les événements correspondants dans le journal d'audit.

### Acceptance Criteria

*   [ ] La liste des membres de l'équipe est chargée depuis l'API.
*   [ ] L'invitation d'un nouveau membre fonctionne et met à jour la liste.
*   [ ] Le changement de rôle et de statut fonctionne et se reflète dans l'UI.
*   [ ] Le journal d'audit affiche les événements réels provenant de l'API.
*   [ ] Les états de chargement et les messages d'erreur sont correctement gérés.

### END STATE

*   **Créés**:
    *   `lib/api-client.ts`
*   **Modifiés**:
    *   `lib/store/team-store.ts`
    *   `lib/store/audit-store.ts`
    *   `app/(dashboard)/team/page.tsx`
    *   `app/(dashboard)/audit/page.tsx`
