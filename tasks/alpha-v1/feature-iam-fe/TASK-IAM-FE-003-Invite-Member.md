# TASK-IAM-FE-003: Invite Member Form & Logic

**Epic:** [epic-1-iam](../annex/epic-1-iam/_plan.md)
**Jalon:** 2 - Team Management UI
**Dépend de:** [TASK-IAM-FE-001-UI-Components](./TASK-IAM-FE-001-UI-Components.md)
**Statut:** To Do

---

### Objectif

Implémenter le formulaire d'invitation d'un nouveau membre, accessible depuis la page "Équipe", et gérer la logique de soumission (sans l'appel API réel).

### Low-Level Steps

1.  **Modal Integration**:
    *   Le clic sur le bouton "Inviter un membre" (de la tâche `FE-002`) doit ouvrir un composant `Dialog`.

2.  **Form Creation**:
    *   Dans la modale, créer un formulaire avec les champs suivants :
        *   `email`: Champ de texte pour l'adresse email de l'invité.
        *   `role`: Champ `Select` avec les options {Admin, CSM, Closer, "À configurer plus tard"}.
    *   Utiliser `zod` pour la validation du schéma du formulaire.

3.  **Form Validation**:
    *   Implémenter la validation côté client :
        *   L'email doit être dans un format valide.
        *   Le rôle est un champ obligatoire.
    *   Afficher les messages d'erreur sous les champs correspondants si la validation échoue.

4.  **Submission Logic (Mocked)**:
    *   Lors de la soumission d'un formulaire valide, simuler un appel API.
    *   Afficher une notification `Toast` de succès ("Invitation envoyée à ...") ou d'erreur ("Cet utilisateur est déjà membre.").
    *   Fermer la modale en cas de succès.

### Acceptance Criteria

*   [ ] Le formulaire d'invitation s'ouvre dans une modale.
*   [ ] La validation des champs `email` et `role` fonctionne comme attendu.
*   [ ] La soumission (mockée) déclenche les notifications `Toast` appropriées.

### END STATE

*   **Créés**:
    *   `app/(dashboard)/team/components/invite-member-dialog.tsx`
*   **Modifiés**:
    *   `app/(dashboard)/team/page.tsx` (pour intégrer la modale)
