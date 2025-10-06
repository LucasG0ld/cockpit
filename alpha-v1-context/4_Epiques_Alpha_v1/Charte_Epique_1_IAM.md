# Charte d'Épique 1 : Socle - Identité & Accès (IAM)

## 1. Objectif de l'Épique :
Pour l'Admin, l'objectif est de sécuriser la plateforme avec une authentification forte (2FA) et de gérer son équipe en invitant des membres et en leur assignant des rôles précis, afin de contrôler qui a accès à quoi dès le premier jour.

## 2. User Stories Fondamentales :
*   En tant qu'utilisateur interne, je veux me connecter de manière sécurisée pour accéder au Cockpit.
*   En tant qu'utilisateur interne, je veux être forcé de configurer une authentification à deux facteurs lors de ma première connexion, afin de protéger l'accès aux données de l'entreprise et des clients.
*   En tant qu'Admin, je veux inviter un nouveau membre d'équipe par email et lui assigner un rôle (CSM, Closer) pour lui donner les permissions appropriées.
*   En tant que nouvel invité, je veux accepter une invitation, vérifier mon email et créer mon compte pour accéder à la plateforme.
*   En tant qu'Admin, je veux désactiver le compte d'un membre (soft-delete) pour révoquer immédiatement son accès.

## 3. Périmètre (In/Out) :

### Inclus :
*   Authentification via Clerk.
*   Authentification à deux facteurs (2FA) obligatoire pour les utilisateurs internes.
*   RBAC pour les rôles Admin, CSM, Closer.
*   Page "Équipe".
*   Flux d'invitation.
*   Logique de désactivation (soft-delete).

### Explicitement Exclu :
*   Rôle "Opérateur".
*   Gestion d'équipe par projet.
*   Permissions fines (ACL).

## 4. Interfaces Principales Affectées :
*   Page de connexion et flux de première connexion (gérés par Clerk, à configurer).
*   Layout principal du Cockpit.
*   Nouvelle page : "Équipe".
*   Emails d'invitation.

## 5. Dépendances Techniques ou Métier :
Cette épique est la fondation. Toutes les autres épiques de l'Alpha v1 dépendent d'elle.