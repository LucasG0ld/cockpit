# TASK-IAM-FE-005: Audit Trail View

**Epic:** [epic-1-iam](../annex/epic-1-iam/_plan.md)
**Jalon:** 2 - Team Management UI
**Dépend de:** [TASK-IAM-FE-001-UI-Components](./TASK-IAM-FE-001-UI-Components.md)
**Statut:** To Do

---

### Objectif

Créer une vue simple pour afficher le journal d'audit des événements IAM, accessible depuis la navigation principale.

### Low-Level Steps

1.  **Page Layout**:
    *   Créer la page `app/(dashboard)/audit/page.tsx`.
    *   Ajouter un titre, par exemple "Journal d'audit".

2.  **Data Table Integration**:
    *   Utiliser le composant `Table` pour afficher les événements d'audit.
    *   Définir les colonnes : `Date`, `Acteur`, `Action`, `Cible`, `Détails`.

3.  **Data Fetching (Mocked)**:
    *   Utiliser des données mockées pour peupler la liste des événements.
    *   Le mock doit inclure des exemples pour chaque type d'événement IAM (`user.team_member.invited`, `user.role.changed`, etc.).

4.  **Metadata Display**:
    *   Dans la colonne `Détails`, afficher les informations pertinentes de la `metadata` de l'événement (ex: `{ "from": "CSM", "to": "Admin" }`).

### Acceptance Criteria

*   [ ] La page du journal d'audit est créée et accessible.
*   [ ] Le tableau affiche correctement les événements d'audit mockés.
*   [ ] Les métadonnées des événements sont lisibles.

### END STATE

*   **Créés**:
    *   `app/(dashboard)/audit/page.tsx`
    *   `app/(dashboard)/audit/components/audit-table.tsx`
*   **Modifiés**: Aucun
