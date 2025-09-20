# Release Plan : ClientFlow

## Partie I : L'ALPHA - Construire l'Environnement de Travail Intégré

### ALPHA v1 : Le Cycle de Vie du Nouveau Client

#### Milestone A1.1 : Le Socle - Identité & CRM

##### Épique 1 : Socle - Identité & Accès (IAM)
*   **Fonctionnalités Clés** :
    *   Authentification sécurisée.
    *   RBAC pour les rôles Admin, CSM, Closer.
    *   Page "Équipe" pour inviter, désactiver (soft-delete) et gérer les membres.

##### Épique 2 : CRM Opérationnel (Fondations)
*   **Fonctionnalités Clés** :
    *   Page "Clients" avec vue tableau.
    *   Fiche Client (Drawer) avec structure d'onglets.
    *   Filtres avancés & Tabs de statut.
    *   Export CSV de la liste.
    *   Validation des champs à la création.

#### Milestone A1.2 : L'Activation - Onboarding & Support

##### Épique 3 : Flux d'Onboarding & Facturation Initiale
*   **Fonctionnalités Clés** :
    *   Page "Templates" avec gestion du cycle de vie (Draft/Published/Archived).
    *   Flux d'activation complet (lien → paiement → signature).
    *   Archivage automatique des PDF (facture, contrat).

##### Épique 4 : Fondations du Support par Tickets
*   **Fonctionnalités Clés** :
    *   Page "Support" avec vue tableau.
    *   Fiche Ticket (fil de conversation, pièces jointes, notes internes).
    *   Création de ticket depuis le portail.