## Charte d'Épique 2 : CRM Opérationnel (Fondations)  

### 1. Objectif de l'Épique :
Pour le CSM et le Closer, l'objectif est de centraliser toutes les informations client dans une interface unique et efficace, afin d'avoir une vision à 360° et de naviguer rapidement vers les actions et données contextuelles.

### 2. User Stories Fondamentales :
* En tant que CSM/Closer, je veux voir tous les clients dans un tableau centralisé pour avoir une vue d'ensemble de mon portefeuille.
* (Ajouté) En tant qu'Admin, je veux créer manuellement un nouvel enregistrement client via un formulaire simple (Nom, Email, Statut initial), afin de pouvoir peupler le CRM pour les besoins de tests et de démonstrations, sans attendre la finalisation du flux d'onboarding (Épique 3).
* En tant que CSM/Closer, je veux utiliser des filtres avancés et des onglets de statut (Onboarding, En projet, etc.) pour trouver rapidement les clients sur lesquels je dois agir.
* En tant que CSM/Closer, je veux cliquer sur un client pour ouvrir une fiche détaillée (drawer) avec des onglets (Infos, Projets, Tickets...) afin d'accéder à tout son contexte.
* En tant qu'Admin, je veux exporter la liste filtrée des clients en CSV pour des besoins de reporting externe.

### 3. Périmètre (In/Out) :

#### Inclus :
* Page "Clients" avec vue tableau.
* Fiche Client (Drawer/Sidebar) avec sa structure d'onglets.
* Filtres avancés et tabs de statut agissant comme des raccourcis.
* Export CSV.
* Validation avancée des champs (email, SIRET) à l'édition.
* (Ajouté) Formulaire de création manuelle de client (minimaliste, pour les Admins).

#### Explicitement Exclu :
* Données financières agrégées (LTV).
* "Mode Démo".
* Actions en masse.
* Statuts clients avancés (ex: segmentation des inactifs).
* (Ajouté) Création de client avec flux de notification ou d'invitation (cette logique complexe est réservée à l'Épique 3).

### 4. Interfaces Principales Affectées :
* Nouvelle page : "Clients".
* Nouveau composant majeur : La Fiche Client (Drawer/Sidebar).
* Composant de filtre réutilisable.
* (Ajouté) Bouton "Ajouter un client".
* (Ajouté) Modal/Formulaire de création de client.

### 5. Dépendances Techniques ou Métier :
Dépend de l'Épique 1 (IAM) pour l'authentification et la gestion des rôles (qui peut voir/modifier quoi).