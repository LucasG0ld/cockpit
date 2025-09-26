# Context input pour PRD Global : "Alpha v1 - Le Cycle de Vie du Nouveau Client"

## Informations Générales
*   **Nom du Projet** : ClientFlow
*   **Version** : 1.0 (Alpha v1)
*   **Responsable (Owner)** : [Nom du Product Owner]

## TL;DR (Mission du Produit)
*   **Pour le Closer** : Construire un outil d'onboarding simple et fiable afin qu'il puisse activer de nouveaux clients de manière standardisée et suivre leur conversion jusqu'au paiement.
*   **Pour le CSM** : Construire une tour de contrôle client de base afin qu'il puisse accueillir les nouveaux clients actifs, visualiser toutes leurs informations et répondre à leurs premières demandes de support.
*   **Pour le client final** : Construire un portail d'onboarding guidé et sécurisé afin qu'il puisse activer son compte, valider son engagement légal et comprendre les premières étapes de sa collaboration.

## Utilisateurs & Valeur

### Utilisateurs principaux / Personas (pour Alpha v1) :
*   **Interne - Le Closer** : Son rôle est central dans cette version. Il initie et suit l'ensemble du processus d'acquisition.
*   **Interne - Le CSM** : Son rôle est de prendre le relais. Il reçoit les clients "prêts à l'emploi" et doit disposer des outils de base pour commencer la relation.
*   **Interne - L'Admin/Founder** : Il gère la configuration initiale des utilisateurs et des templates.
*   **Externe - Le Nouveau Client** : Il suit le parcours d'activation, de l'invitation à la signature.

### Jobs-to-be-Done (JTBD) :
*   **(Closer)** Quand je signe un nouveau client, je veux lui envoyer un lien unique qui gère l'inscription et le paiement, pour pouvoir suivre sa conversion sans friction et passer le relais proprement au CSM.
*   **(Client)** Quand j'active mon compte, je veux être guidé à travers un processus clair pour valider mes informations légales et signer mon contrat, pour pouvoir accéder à mon espace de travail en toute confiance.

### Principaux points de douleur à résoudre (pour Alpha v1) :
*   **Fragmentation du Processus d'Onboarding** : Les informations sont dispersées entre emails, CRM externe et facturation manuelle.
*   **Manque de Visibilité sur la Conversion** : Le suivi de l'avancement d'un prospect (invité, en attente de paiement) est manuel et peu fiable.
*   **Expérience Client Décousue** : Le client reçoit des informations de plusieurs sources, ce qui crée de la confusion lors des premières étapes critiques.

## Métriques de Succès
*   **Objectif principal (en langage simple)** : L'Alpha v1 est un succès si nous pouvons onboarder 100% de nos nouveaux clients via la plateforme, en réduisant le temps de gestion manuelle du Closer de 75%.

### Critères de succès :
*   **Onboarding Velocity (Activation)** : `Timestamp(compte activé) - Timestamp(lien d'onboarding envoyé)` (Objectif: < 1 heure)
*   **Template Adoption Rate** : `(Nouveaux clients onboardés via un Template / Total nouveaux clients) * 100` (Objectif: > 95%)
*   **Taux d'Erreur de Handoff** : Nombre de cas où le CSM doit demander au Closer des informations manquantes sur un nouveau client (Objectif: 0)

## Périmètre (Scope)

### Must-Have (Pour Alpha v1) :
*   **Socle - Identité & Accès (IAM)** : Une page "Équipe" pour inviter, désactiver (soft-delete) et gérer les rôles (Admin, CSM, Closer), avec authentification à deux facteurs (2FA) obligatoire pour l'équipe interne.
*   **CRM Opérationnel (Fondations)** : Une page "Clients" avec un tableau, des filtres avancés et des tabs de statut. Une Fiche Client (drawer) avec une structure d'onglets pour centraliser les informations. L'export CSV de la liste est inclus.
*   **Gestion des Templates (Création)** : Une page "Templates" unifiée pour permettre à l'Admin de créer et de gérer le cycle de vie (Draft, Published, Archived) des Templates.
*   **Flux d'Onboarding Complet** : Le parcours complet : génération du lien par le Closer → inscription et paiement par le client → parcours post-paiement (Vidéo → Légal → Signature) → accès au portail avec la checklist.
*   **Archivage Automatique** : Le PDF de la facture initiale et du contrat signé doit être archivé dans le Drive.
*   **Fondations du Support par Tickets** : Une page "Support" avec un tableau et une Fiche Ticket détaillée.

### Nice-to-Have (Prévu pour Alpha v2 et au-delà) :
*   Gestion de Projet Intelligente.
*   Base de Connaissance (page "Notes").
*   Gestion de Fichiers centralisée.
*   Séquences de relances de factures.
*   Migration des clients existants.

### Explicitly Out (Non inclus dans l'Alpha v1) :
*   Toute fonctionnalité de reporting ou de dashboard (KPIs).
*   Toute forme de versioning ou de snapshot.
*   Toute action en masse (bulk actions).
*   Les SLA de support.
*   Les Packs Commerciaux et quotas dynamiques.
*   Toute fonctionnalité d'IA.

### Définition de Terminé (DoD) pour le Jalon Alpha v1 :
*   ✅ Un Admin peut inviter un nouveau CSM et lui assigner le rôle. Le nouveau CSM est obligé de configurer le 2FA à sa première connexion.
*   ✅ Un Closer peut, depuis la page "Clients", créer un nouveau client en lui associant un Template Offre et un Plan de Paiement.
*   ✅ Un Client peut utiliser le lien reçu pour payer sa première facture et signer son contrat, activant ainsi son accès complet au portail.
*   ✅ Un CSM peut, depuis la Fiche Client du nouveau client, voir que le projet et la checklist ont été créés automatiquement.
*   ✅ Un Client peut créer un ticket de support depuis son portail, et le CSM peut y répondre depuis le Cockpit.

## Stack Technique (Contraintes Imposées)
*   **Frontend** : Next.js (App Router, TypeScript), shadcn/ui, Tailwind CSS.
*   **Backend** : Nest.js.
*   **Base de Données** : Neon (PostgreSQL) avec Prisma.
*   **Stockage de fichiers** : Cloudflare R2.
*   **Authentification** : Clerk.
*   **API tierces** : Qonto (pour génération de lien de paiement et PDF), Cal.com, Airtable, DigSign.
*   **Test** : Jest.