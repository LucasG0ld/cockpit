# PRD : IAM — Socle (Épique 1)

**Version:** 1.0
**Date:** 2025-09-29
**Auteur:** PO Technique (IA)
**Épique parente:** `alpha-v1-context/3_PRD_Global_Alpha_v1.md` — section « Épique 1 — IAM (socle) »

---

### 1. Objectif Principal (Le "Pourquoi")
Sécuriser l'accès au Cockpit et poser les fondations d'IAM multi-tenant: authentification forte (2FA), gestion des invitations/activations, rôles (Admin, CSM, Closer) et traçabilité via audit log, afin de garantir un contrôle d'accès strict et auditable dès le premier jour.

---

### 2. Personas Utilisateurs
* Interne — Admin
* Interne — CSM
* Interne — Closer
* Externe — Client (concerné par AuthN/2FA email, mais non par la Page Équipe)

---

### 3. User Stories & Critères d'Acceptation (Le "Quoi")

> Note de Modélisation — Identity vs Membership
> - Identity: représente l'identité globale d'un utilisateur (ex: `clerkId`, `email`).
> - Membership: représente l'appartenance d'une Identity à une `Organization`, et porte le `role` et le `status` (ainsi que le contexte d'org).
> - Conséquence: les opérations de rôle, statut, désactivation/réactivation et transferts s'appliquent à la Membership (scopée à l'organisation), pas à l'Identity globale.

#### US-1: Connexion sécurisée (Clerk) et 2FA obligatoire
*   **En tant que** utilisateur interne,
*   **Je veux** être forcé de configurer et d'utiliser une 2FA email à ma première connexion,
*   **Afin de** sécuriser l'accès aux données sensibles.

**Critères d'Acceptation :**
*   [ ] **Given** un utilisateur interne se connecte pour la première fois, **When** il s'authentifie via Clerk, **Then** l'activation 2FA est bloquante avant tout accès au Cockpit.
*   [ ] **Given** un code 2FA expiré, **When** l'utilisateur le soumet, **Then** afficher le message: "Code expiré. Demandez un nouveau code." et proposer l'envoi d'un nouveau code.
*   [ ] **Given** 5 tentatives 2FA infructueuses, **When** la 5e tentative échoue, **Then** le compte est verrouillé (sans délai de réinitialisation automatique) et un pop-up indique de contacter l'Admin/Support pour déblocage.
*   [ ] **Given** un client non vérifié, **When** il tente d'accéder au portail, **Then** la vérification email est obligatoire avant toute page du portail.
*   [ ] **Given** un JWT sans `orgId` ou `role` ou avec valeurs invalides, **When** le backend (Nest) valide le JWT, **Then** retourner HTTP 401.
*   [ ] **Given** un accès à une ressource d'une autre organisation, **When** `orgId` ne correspond pas, **Then** retourner HTTP 403.

#### US-2: Invitation d'un membre depuis la Page « Équipe »
*   **En tant que** Admin,
*   **Je veux** inviter un membre par email et sélectionner son rôle ou différer la configuration,
*   **Afin de** contrôler l'accès à l'équipe.

**Critères d'Acceptation :**
*   [ ] **Given** un email au format invalide, **When** je clique "Inviter", **Then** afficher: "Adresse email invalide." et ne pas créer d'invitation.
*   [ ] **Given** un email déjà membre de la même `orgId`, **When** je clique "Inviter", **Then** afficher: "Cet utilisateur est déjà membre." et ne pas créer d'invitation.
*   [ ] **Given** un email existant dans une autre organisation, **When** je clique "Inviter", **Then** autoriser l'invitation (isolation par `orgId`).
*   [ ] **Given** le champ Rôle, **When** je prépare l'invitation, **Then** le champ est obligatoire avec options {Admin, CSM, Closer, "À configurer plus tard"}.
*   [ ] **Given** une invitation créée, **When** le lien est généré, **Then** sa durée de vie est 72 heures et il est à usage unique (token unique associé à l'email).
*   [ ] **Given** une invitation existante au cours des dernières 24h pour (`orgId`, `email`), **When** un autre user tente d'inviter le même email, **Then** afficher une notification indiquant que cet email a déjà été invité par l'utilisateur A (idempotence anti-spam sur 24h).
*   [ ] **Given** une invitation envoyée, **When** je consulte l'audit, **Then** un événement `user.team_member.invited` est enregistré (succès uniquement).

#### US-3: Acceptation d'invitation et activation du compte
*   **En tant que** invité,
*   **Je veux** accepter l'invitation via un lien, créer mon compte Clerk, vérifier mon email et activer ma 2FA si interne,
*   **Afin de** accéder à la plateforme selon mon rôle.

**Critères d'Acceptation :**
*   [ ] **Given** un lien d'invitation expiré, **When** je l'ouvre, **Then** afficher: "Invitation expirée. Demandez un nouvel envoi à votre Admin." et ne pas permettre l'activation.
*   [ ] **Given** un lien d'invitation déjà consommé, **When** je le rouvre, **Then** l'accès est refusé (token invalide) et aucune nouvelle activation n'est possible.
*   [ ] **Given** une invitation avec rôle {Admin/CSM/Closer}, **When** j'accepte et finalise la vérification email, **Then** j'accède au Cockpit selon mon rôle et un `user.team_member.activated` est journalisé.
*   [ ] **Given** une invitation avec option "À configurer plus tard", **When** j'accepte, **Then** mon compte est créé avec rôle "Temporaire" sans permissions et un Admin doit m'assigner un rôle définitif avant tout accès au Cockpit.
*   [ ] **Given** un invité interne, **When** je termine la création de mot de passe, **Then** la configuration 2FA email est immédiatement exigée avant tout accès.

#### US-4: Changement de rôle d'un membre (Membership)
*   **En tant que** Admin,
*   **Je veux** modifier le rôle d'un membre (y compris le mien),
*   **Afin de** ajuster ses permissions.

**Critères d'Acceptation :**
*   [ ] **Given** un changement de rôle réussi, **When** l'opération se termine, **Then** invalider les sessions actives du membre, lui afficher un pop-up l'informant du changement et l'obliger à se déconnecter.
*   [ ] **Given** un changement de rôle, **When** le rôle entraîne des responsabilités différentes, **Then** l'Admin est invité à réassigner les éléments rattachés à l'ancien rôle (logique similaire aux transferts lors d'une désactivation) avant validation.
*   [ ] **Given** un changement de rôle, **When** l'opération réussit, **Then** journaliser `user.role.changed` avec `metadata: {from, to}` (succès uniquement).

#### US-5: Désactivation (soft-delete) et Réactivation d'un membre (Membership)
*   **En tant que** Admin,
*   **Je veux** désactiver puis éventuellement réactiver un membre,
*   **Afin de** contrôler l'accès et assurer la continuité de service.

**Critères d'Acceptation :**
*   [ ] **Given** la désactivation d'un membre, **When** je confirme, **Then** invalider immédiatement toutes ses sessions et journaliser `user.status.changed` avec `metadata: {from: Active, to: Disabled}`.
*   [ ] **Given** la désactivation d'un CSM avec clients actifs, **When** je tente de valider, **Then** l'action est bloquée tant que tous les clients actifs ne sont pas réassignés à un autre membre.
*   [ ] **Given** la désactivation d'un Closer, **When** un client finalise son onboarding via un lien envoyé par ce Closer, **Then** ce client est automatiquement assigné à l'Admin ayant effectué la désactivation et un événement d'audit est enregistré.
*   [ ] **Given** une réactivation, **When** je confirme, **Then** le membre est assigné au rôle "Temporaire" sans permissions et l'Admin doit lui assigner manuellement un rôle définitif.
*   [ ] **Given** un compte désactivé, **When** J+0 → J+14, **Then** les données sont conservées; **And** après J+14, suppression des PII (documents légaux/financiers et événements d'audit conservés).

#### US-6: Multi-tenant strict (`orgId`) et contrôles d'accès
*   **En tant que** système,
*   **Je veux** filtrer toutes les données par `orgId` et empêcher tout accès cross-org,
*   **Afin de** garantir l'étanchéité entre organisations.

**Critères d'Acceptation :**
*   [ ] **Given** une liste de ressources, **When** un utilisateur requête le backend, **Then** la liste est toujours filtrée côté serveur par `orgId` extrait du JWT.
*   [ ] **Given** un `orgId` du JWT différent de la ressource demandée, **When** l'utilisateur requête, **Then** retourner 403 (mismatch d'organisation).
*   [ ] **Given** des endpoints protégés, **When** le JWT ne contient pas `orgId` et `role` stricts (`org_<ulid>`, {Admin, CSM, Closer, Client, Temporaire}), **Then** retourner 401.

#### US-7: Journal d'audit (succès uniquement pour IAM)
*   **En tant que** Admin/CSM/Closer,
*   **Je veux** consulter les événements IAM majeurs,
*   **Afin de** assurer la traçabilité.

**Critères d'Acceptation :**
*   [ ] **Given** une action IAM réussie, **When** elle se termine, **Then** enregistrer un événement d'audit avec les champs minimum `{orgId, actorId, type, targetId, metadata, createdAt}`. `actorId` référence une Identity; le contexte d'organisation est défini par `orgId`. `metadata` peut inclure `membershipId` lorsque pertinent (ex: changements de rôle/statut).
*   [ ] **Given** les actions suivantes, **When** elles réussissent, **Then** tracer: `user.team_member.invited`, `user.team_member.activated`, `user.role.changed`, `user.status.changed`.
*   [ ] **Given** une action IAM échouée, **When** elle se termine en erreur, **Then** ne pas tracer d'événement (sauf exceptions métiers non IAM comme `payment.failed`, hors périmètre de cette feature).

---

### 4. Contraintes Techniques et Non-Fonctionnelles
*   Authentification/Autorisation: Clerk (sessions/2FA email), guard NestJS global vérifiant le JWT HS256 fourni par Clerk; claims minimales: `sub`, `orgId`, `role`. Le guard renseigne `req.auth = {userId, orgId, role}` et renvoie 401 si claims absents/invalides, 403 si `orgId` ≠ ressource. Voir PRD Global §4 et §10.
*   Multi-tenant: toutes les données scoppées strictement par `orgId`. Voir PRD Global §4 et §10.
*   2FA: email obligatoire pour internes (et clients côté portail) ; 5 tentatives → verrouillage compte jusqu'à déblocage manuel. Messages exacts définis en US-1. Voir PRD Global §5.
*   Invitations: lien à usage unique, expiration 72h; idempotence anti-spam 24h par (`orgId`, `email`) avec attribution de l'invitant initial dans le message. Voir US-2.
*   Rôles: internes {Admin, CSM, Closer}. État spécial "Temporaire" sans permission (post-réactivation ou post-acceptation si "À configurer plus tard").
*   Audit log: succès uniquement pour IAM; structure minimale en §3 US-7. Voir PRD Global §6 et §11.
*   Observabilité: événements visibles dans la page « Audits » minimale. Voir PRD Global §11.
*   Performance/UX: validations synchrones pour email/role; latence acceptable pour envoi d'email d'invitation (<5s perçu).

---

### 5. Périmètre (Scope)

#### Ce qui est Inclus :
* Page « Équipe »: inviter membre, choisir rôle (ou "À configurer plus tard"), désactiver/réactiver, changer rôle; UI validations/messages définis ci-dessus.
* Flux d'acceptation d'invitation: création compte via Clerk, vérification email, 2FA immédiate pour internes; gestion de lien expiré/consommé.
* Middleware NestJS: validation JWT (401 si claims manquants/invalides; 403 si mismatch `orgId`), extraction des claims (`orgId`, `role`).
* Multi-tenant: filtrage serveur par `orgId` pour toutes listes/ressources IAM.
* Continuité de service: transfert forcé des clients d'un CSM à la désactivation; réassignation onboarding Closer → Admin désactivateur.
* Journal d'audit: émission des événements IAM de succès listés; UI de consultation minimale.

#### Ce qui est Exclu (Pour de Futures Tâches) :
* Permissions fines (ACL) au-delà des rôles Admin/CSM/Closer.
* Rôle "Opérateur".
* SLA, reporting avancé, SSO non-Clerk, méthodes 2FA alternatives (app TOTP/SMS), rotation/révocation avancée des magic links (post-Alpha, cf. TECH_DEBT dans PRD Global).


