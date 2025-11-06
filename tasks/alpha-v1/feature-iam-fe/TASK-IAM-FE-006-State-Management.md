# TASK-IAM-FE-006: State Management for Team & Audit

**Epic:** [epic-1-iam](../annex/epic-1-iam/_plan.md)
**Jalon:** 2 - Team Management UI
**Statut:** To Do

---

### Objectif

Mettre en place un store de gestion d'état (Zustand) pour gérer de manière centralisée les données de la page "Équipe" et du journal d'audit.

### Low-Level Steps

1.  **Store Setup**:
    *   Installer et configurer Zustand.
    *   Créer un `teamStore` pour gérer la liste des membres, l'état de chargement et les erreurs.
    *   Créer un `auditStore` pour gérer la liste des événements d'audit.

2.  **Team Store Actions**:
    *   Définir les actions pour le `teamStore` :
        *   `fetchMembers`: Pour récupérer la liste des membres.
        *   `inviteMember`: Pour ajouter un membre (après succès de l'API).
        *   `updateMember`: Pour mettre à jour le rôle ou le statut d'un membre.

3.  **Audit Store Actions**:
    *   Définir l'action `fetchAuditEvents` pour récupérer les logs.

4.  **Store Integration (Hooks)**:
    *   Créer des hooks personnalisés (ex: `useTeamStore`, `useAuditStore`) pour faciliter l'accès au store depuis les composants React.

### Acceptance Criteria

*   [ ] Les stores Zustand pour l'équipe et l'audit sont créés.
*   [ ] Les actions pour récupérer et manipuler les données sont définies (sans l'implémentation des appels API).
*   [ ] Les hooks personnalisés permettent d'accéder aux états et actions des stores.

### END STATE

*   **Créés**:
    *   `lib/store/team-store.ts`
    *   `lib/store/audit-store.ts`
*   **Modifiés**: Aucun
