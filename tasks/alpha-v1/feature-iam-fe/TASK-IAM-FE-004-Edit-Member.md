# TASK-IAM-FE-004: Edit Member Logic

**Epic:** [epic-1-iam](../annex/epic-1-iam/_plan.md)
**Jalon:** 2 - Team Management UI
**Dépend de:** [TASK-IAM-FE-001-UI-Components](./TASK-IAM-FE-001-UI-Components.md)
**Statut:** To Do

---

### Objectif

Implémenter la logique de modification du rôle et du statut d'un membre existant via le menu d'actions de la table des membres.

### Low-Level Steps

1.  **Edit Role Modal**:
    *   Le clic sur "Modifier le rôle" dans le `DropdownMenu` doit ouvrir une modale de confirmation.
    *   La modale affichera le nom de l'utilisateur et un champ `Select` pré-rempli avec son rôle actuel.
    *   La modification et la validation (mockée) doivent afficher un `Toast` de succès et mettre à jour l'état local (mocké) de la table.

2.  **Disable/Re-enable Action**:
    *   Le clic sur "Désactiver" ou "Réactiver" doit ouvrir une modale de confirmation simple (ex: "Êtes-vous sûr de vouloir désactiver cet utilisateur ?").
    *   La validation (mockée) doit afficher un `Toast` de succès et mettre à jour le statut de l'utilisateur dans l'état local (mocké) de la table.

3.  **Conditional Rendering**:
    *   L'option dans le `DropdownMenu` doit changer dynamiquement de "Désactiver" à "Réactiver" en fonction du statut actuel de l'utilisateur.

### Acceptance Criteria

*   [ ] La modale de changement de rôle permet de sélectionner un nouveau rôle et de simuler la mise à jour.
*   [ ] La modale de confirmation pour la désactivation/réactivation fonctionne.
*   [ ] Les actions (mockées) mettent à jour l'affichage dans la table des membres.
*   [ ] L'option de menu pour le statut est conditionnelle.

### END STATE

*   **Créés**:
    *   `app/(dashboard)/team/components/edit-role-dialog.tsx`
    *   `app/(dashboard)/team/components/toggle-status-dialog.tsx`
*   **Modifiés**:
    *   `app/(dashboard)/team/components/team-table.tsx` (pour intégrer les modales d'action)
