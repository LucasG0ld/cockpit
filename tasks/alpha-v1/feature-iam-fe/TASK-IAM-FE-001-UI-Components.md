# TASK-IAM-FE-001: UI Components for Team Management

**Epic:** [epic-1-iam](../annex/epic-1-iam/_plan.md)
**Jalon:** 2 - Team Management UI
**Statut:** To Do

---

### Objectif

Créer la bibliothèque de composants React (shadcn/ui) de base, réutilisables et "dumb" (sans logique métier) qui seront nécessaires pour construire l'interface de gestion de l'équipe.

### Low-Level Steps

1.  **Button Component**:
    *   Créer une variante stylisée du composant `Button` pour les actions principales (ex: "Inviter", "Enregistrer").

2.  **Input & Form Components**:
    *   Configurer les composants `Input`, `Label`, et `Select` pour les formulaires d'invitation et d'édition.

3.  **Modal/Dialog Component**:
    *   Implémenter un composant `Dialog` pour les actions de confirmation (ex: désactivation d'un membre, changement de rôle).

4.  **Data Table Component**:
    *   Mettre en place un composant `Table` pour afficher la liste des membres de l'équipe.
    *   La table doit inclure des colonnes pour le nom/email, le rôle, le statut, et un menu d'actions (`DropdownMenu`).

5.  **Toast/Notification Component**:
    *   Configurer le composant `Toast` pour afficher des notifications de succès ou d'erreur suite aux actions de l'utilisateur.

### Acceptance Criteria

*   [ ] Tous les composants sont développés en isolation et testés avec Storybook.
*   [ ] Les composants sont purement présentationnels et reçoivent leurs données et callbacks via des props.
*   [ ] Le style est cohérent avec la charte graphique existante.

### END STATE

*   **Créés**:
    *   `components/ui/button.tsx`
    *   `components/ui/input.tsx`
    *   `components/ui/label.tsx`
    *   `components/ui/select.tsx`
    *   `components/ui/dialog.tsx`
    *   `components/ui/table.tsx`
    *   `components/ui/dropdown-menu.tsx`
    *   `components/ui/toast.tsx`
    *   `components/ui/toaster.tsx`
*   **Modifiés**: Aucun
