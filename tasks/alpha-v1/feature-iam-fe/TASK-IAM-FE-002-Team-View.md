# TASK-IAM-FE-002: Team View Page

**Epic:** [epic-1-iam](../annex/epic-1-iam/_plan.md)
**Jalon:** 2 - Team Management UI
**Dépend de:** [TASK-IAM-FE-001-UI-Components](./TASK-IAM-FE-001-UI-Components.md)
**Statut:** To Do

---

### Objectif

Développer la page principale "Équipe" qui affiche la liste des membres de l'organisation en utilisant les composants de base.

### Low-Level Steps

1.  **Page Layout**:
    *   Créer la structure de base de la page `app/(dashboard)/team/page.tsx`.
    *   Ajouter un titre et le bouton "Inviter un membre".

2.  **Data Table Integration**:
    *   Intégrer le composant `Table` créé dans la tâche `FE-001`.
    *   Définir les colonnes : `Email`, `Rôle`, `Statut`, `Actions`.

3.  **Data Fetching (Mocked)**:
    *   Pour cette tâche, utiliser des données mockées pour peupler le tableau. L'intégration API réelle sera faite dans une tâche ultérieure.
    *   Le mock doit inclure des utilisateurs avec différents rôles et statuts pour valider l'affichage.

4.  **Actions Menu**:
    *   Dans la colonne `Actions`, intégrer un `DropdownMenu` pour chaque membre.
    *   Les actions disponibles (pour l'instant non fonctionnelles) seront : "Modifier le rôle", "Désactiver" / "Réactiver".

### Acceptance Criteria

*   [ ] La page affiche correctement la liste des membres à partir de données mockées.
*   [ ] Le bouton "Inviter un membre" est présent.
*   [ ] Chaque ligne du tableau a un menu d'actions avec les options appropriées.

### END STATE

*   **Créés**:
    *   `app/(dashboard)/team/page.tsx`
    *   `app/(dashboard)/team/components/team-table.tsx`
*   **Modifiés**: Aucun
