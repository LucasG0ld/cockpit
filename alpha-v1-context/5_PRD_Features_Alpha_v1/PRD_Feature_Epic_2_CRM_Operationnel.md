# PRD : Épique 2 - Fondations du CRM Opérationnel

**Version:** 1.0
**Date:** 2025-11-13
**Auteur:** Cascade
**Épique parente:** `alpha-v1-context/3_PRD_Global_Alpha_v1.md`

---

### 1. Objectif Principal (Le "Pourquoi")

L'objectif est de construire le référentiel central des clients et de fournir à l'équipe interne (CSM, Closer) une interface opérationnelle unique pour gérer le portefeuille, avoir une vision à 360° et accéder rapidement aux informations contextuelles, tout en permettant aux Admins et Closers de peupler le CRM manuellement.

---

### 2. Personas Utilisateurs

*   **Admin :** Crée manuellement des clients, exporte des données.
*   **Closer :** Crée des clients, gère son portefeuille, consulte les informations des prospects et clients.
*   **CSM :** Gère son portefeuille, consulte les informations des clients actifs.

---

### 3. User Stories & Critères d'Acceptation (Le "Quoi")

#### US-1: Visualisation du Portefeuille Client
*   **En tant que** Admin, CSM ou Closer,
*   **Je veux** voir tous les clients dans un tableau centralisé,
*   **Afin de** avoir une vue d'ensemble de mon portefeuille.

**Critères d'Acceptation :**
*   [ ] **Given** je suis connecté et sur la page "/clients", **When** la page se charge, **Then** je vois un tableau affichant les clients avec les colonnes : "Contact", "Organisation", "Email", "Téléphone", "Owner (Closer)", "Owner (CSM)", "Statut Client", et "Statut Onboarding".
*   [ ] **Given** la liste des clients est longue, **When** je navigue en bas du tableau, **Then** une pagination doit être présente pour charger les clients suivants.

#### US-2: Création Manuelle d'un Client
*   **En tant que** Admin ou Closer,
*   **Je veux** créer manuellement un nouvel enregistrement client via un formulaire simple,
*   **Afin de** pouvoir peupler le CRM pour les tests (Admin) ou initier un nouveau prospect (Closer).

**Critères d'Acceptation :**
*   [ ] **Given** je suis un Admin ou un Closer sur la page "/clients", **When** je clique sur le bouton "Ajouter un client", **Then** un formulaire modal s'ouvre.
*   [ ] **Given** le formulaire de création est ouvert, **When** je remplis tous les champs obligatoires ("Prénom", "Nom", "Email", "Owner (Closer)"), **Then** le bouton de soumission devient actif.
*   [ ] **Given** je soumets le formulaire valide, **When** l'action est traitée, **Then** un nouveau client est créé en base de données avec le "Statut Client" à `Invité` et le "Statut Onboarding" à `Lien généré`.
*   [ ] **Given** je suis un Closer et j'ouvre le formulaire, **When** le champ "Owner (Closer)" est affiché, **Then** il est pré-rempli avec mon nom.
*   [ ] **Given** je suis un Admin et j'ouvre le formulaire, **When** je consulte le champ "Owner (Closer)", **Then** il s'agit d'un sélecteur obligatoire qui n'a pas de valeur par défaut.
*   [ ] **Given** je suis un Admin et je clique sur le sélecteur "Owner (Closer)", **When** la liste d'options s'affiche, **Then** elle contient tous les utilisateurs internes de l'organisation (y compris moi-même) avec leur nom et leur rôle (ex: "Jane Doe - Admin").

#### US-3: Consultation Détaillée d'un Client
*   **En tant que** Admin, CSM ou Closer,
*   **Je veux** cliquer sur un client pour ouvrir une fiche détaillée (drawer),
*   **Afin d'** accéder à tout son contexte.

**Critères d'Acceptation :**
*   [ ] **Given** je suis sur le tableau des clients, **When** je clique sur la ligne d'un client, **Then** un panneau latéral (Drawer) s'ouvre avec les informations de ce client.
*   [ ] **Given** le drawer est ouvert, **When** je consulte l'onglet "Infos générales", **Then** je vois les sections "Informations générales sur le client" et "Informations générales sur l’organisation" avec tous les champs spécifiés.
*   [ ] **Given** le drawer est ouvert, **When** je clique sur les onglets "Projets", "Tickets", ou "Factures", **Then** je vois un message placeholder indiquant que la fonctionnalité sera bientôt disponible.
*   [ ] **Given** le drawer est ouvert dans l'onglet "Infos générales", **When** je regarde la section "Informations générales sur le client", **Then** je vois le champ "Lien d'invitation" avec le lien et un bouton "Régénérer le lien" (le bouton est un élément UI sans logique fonctionnelle pour cette épique).

    *Note de conception : Ce composant (champ + bouton) doit être conçu de manière à être réutilisable et pilotable par la logique qui sera développée dans l'Épique 3.*

#### US-4: Export de Données
*   **En tant que** Admin,
*   **Je veux** exporter la liste filtrée des clients en CSV,
*   **Afin de** réaliser des besoins de reporting externe.

**Critères d'Acceptation :**
*   [ ] **Given** je suis un Admin sur la page "/clients", **When** je clique sur le bouton "Exporter en CSV", **Then** un fichier CSV est téléchargé.
*   [ ] **Given** j'ai appliqué un filtre sur la liste (ex: Statut Client = 'Actif'), **When** j'exporte en CSV, **Then** le fichier ne contient que les clients correspondant au filtre.
*   [ ] **Given** le fichier CSV est généré, **When** je l'ouvre, **Then** il contient toutes les colonnes des sections "Informations générales sur le client" et "Informations générales sur l’organisation".

---

### 4. Contraintes Techniques et Non-Fonctionnelles

*   **Modèle de Données :** Le modèle de l'entité `Organization` devra être étendu pour inclure les champs suivants : "Nom de l'entreprise", "Forme juridique", "Civilité du représentant légal", "Nom complet du représentant", "Poste du représentant", "Numéro RCS / SIRET", "Ville d’immatriculation RCS", "Adresse du siège social", "Code postal du siège social", "Ville du siège social".
*   **Unicité :** Le champ `Email` du client doit être unique dans la base de données.
*   **Interface :** L'interface doit être développée en utilisant la librairie `shadcn/ui` et respecter les conventions de style de Tailwind CSS déjà en place.
*   **Performance :** Le tableau des clients doit utiliser une pagination côté serveur pour garantir la réactivité de l'interface, même avec un grand volume de données.

---

### 5. Périmètre (Scope)

#### Ce qui est Inclus :
*   Page "Clients" avec vue tableau paginée.
*   Formulaire de création manuelle de client pour les Admins et les Closers.
*   Fiche Client (Drawer) avec un onglet "Infos générales" détaillé et des onglets placeholders pour les autres sections.
*   Export CSV des données clients avec respect des filtres.

#### Ce qui est Exclu (Pour de Futures Tâches) :
*   La logique fonctionnelle de génération et d'envoi du lien d'onboarding (sera traité dans l'Épique 3).
*   La logique de régénération du lien d'invitation.
*   Le contenu et la logique fonctionnelle des onglets "Projets", "Tickets", et "Factures" dans la Fiche Client.
*   Les actions en masse sur la liste des clients.
