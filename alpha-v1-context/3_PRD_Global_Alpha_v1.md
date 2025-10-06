# PRD Global — Alpha v1 — ClientFlow

## 0. Contexte et Objectif

ClientFlow vise l’indépendance opérationnelle de l’équipe en Alpha v1 via un « produit de remplacement viable » permettant de gérer 100% du portefeuille client sans outils externes.
**North Star**: réduire de 75% le temps de gestion manuelle du Closer.

## 1. Périmètre (Scope) et Épiques

**Épiques et dépendances:**
*   **Épique 1 — IAM (socle) [P0]**
*   **Épique 2 — CRM (fondations) [P0]** — dépend de IAM
*   **Épique 3 — Onboarding & Facturation (flux complet) [P0]** — dépend de IAM et CRM
*   **Épique 4 — Support par Tickets [P0]** — dépend de IAM et CRM

**Hors de portée:** reporting/dashboards, versioning/snapshots, bulk actions, SLA support, packs commerciaux/quotas, IA (cf. Out of Scope).

## 2. Utilisateurs, Personas, JTBD

*   **Interne — Admin/Founder:** gère IAM, configuration et exports.
*   **Interne — Closer:** initie et suit l’acquisition, envoie les liens d’onboarding.
*   **Interne — CSM:** prend le relais post-activation, gère support et suivi.
*   **Externe — Nouveau Client:** complète l’onboarding guidé jusqu’à l’accès au portail.

**JTBD clés:**
*   **Closer:** envoyer un lien unique d’onboarding (inscription + paiement), suivre conversion.
*   **Client:** être guidé pour valider les infos légales, signer, puis accéder au portail.

## 3. Mesures de Succès (Alpha v1)

*   **Onboarding Velocity:** envoi du lien → activation du compte; objectif < 1 h.
*   **Template Adoption Rate:** > 95% des onboardings via template.
*   **Handoff Error Rate (Closer → CSM):** 0 réouvertures pour info manquante.

## 4. Architecture & Contraintes Techniques

*   **Frontend:** Next.js (App Router, TypeScript, shadcn/ui, Tailwind CSS). i18n: FR uniquement.
*   **Backend:** NestJS (TypeScript) comme couche domaine. Prisma + Neon (PostgreSQL). Webhooks Qonto/Cal.com. Audit log.
*   **AuthN/AuthZ:** Clerk (dev/prod). Front émet JWT Clerk. NestJS vérifie JWT (claims minimales: `orgId`, `role`). 2FA par email pour tous (interne et clients) à l’Alpha.
*   **Stockage:** Cloudflare R2 (source de vérité fichiers). « Drive » = UI pour manipuler R2.
*   **Signature:** DigiSigner (un template contrat unique à l’Alpha).
*   **Paiement:** Qonto (lien unique par client; webhooks succès/échec).
*   **Autres:** Cal.com (webhook booking → « Kick off réservé »). Tests: Jest.
*   **Multi-tenant:** toutes les données scoppées strictement par `orgId`. Un utilisateur interne ∈ 1 seule organisation (Alpha).

**Note de cadrage:** le contexte initial mentionnait « Backend: Next.js API Routes ». Décision validée: Backend = NestJS dédié.

## 5. Rôles, Sécurité, RBAC

**2FA:** email pour l’équipe interne et les clients (à l’Alpha). Vérification email obligatoire au 1er login client.

**Matrice d’autorisations (extrait exécutable à l’Alpha):**

| Feature | Admin | CSM | Closer |
| :--- | :---: | :---: | :---: |
| **CRM** | | | |
| Voir la liste clients | ✅ | ✅ | ✅ |
| Créer client | ✅ | ❌ | ✅ |
| Modifier client | ✅ | ✅ | ✅ |
| Exporter CSV clients | ✅ | ❌ | ❌ |
| **Équipe (IAM)** | | | |
| Inviter/Désactiver/Changer rôles | ✅ | ❌ | ❌ |
| **Templates** | | | |
| Créer/Modifier/Publier/Archiver | ✅ | ✅ | ❌ |
| **Support (Tickets)** | | | |
| Voir tous tickets | ✅ | ✅ | ✅ |
| Répondre/Gérer | ✅ | ✅ | ✅ |
| **Facturation** | | | |
| Voir page « Factures » | ✅ | ✅ | ✅ |
| Exporter CSV factures | ✅ | ❌ | ❌ |
| **Système & Audit** | | | |
| Consulter journal d’audit | ✅ | ✅ | ✅ |
| Gérer webhooks échoués | ✅ | ✅ | ✅ |

### Politique de Continuité de Service (Gestion des transferts)

Pour garantir la continuité du service client et la traçabilité des actions, les règles suivantes s'appliquent lors de la désactivation (soft-delete) d'un utilisateur interne :

*   **Transfert des clients d'un CSM :** Lors de la désactivation d'un CSM, le système doit forcer l'Admin à réassigner tous les clients actifs de ce CSM à un autre membre de l'équipe avant de valider l'action.
*   **Transfert des onboardings d'un Closer :** Les liens d'onboarding envoyés par un Closer désactivé restent valides. Si un client complète son inscription via un de ces liens, il est automatiquement assigné à l'Admin ayant procédé à la désactivation. L'Admin est alors notifié et responsable de sa réassignation manuelle au Closer approprié.

### Comptes désactivés (soft-delete):

*   **J+0 → J+14:** compte désactivé, données conservées.
*   **Après J+14:** suppression des données, sauf éléments liés à l’activité (documents légaux/financiers exclus de la purge).

## 6. Domaines Fonctionnels par Épique

### Épique 1 — IAM (socle)

**Objectif:** mettre en place les fondations d'identité, d'accès, de multi-tenant et de sécurité pour garantir une auditabilité et un contrôle des permissions dès le premier jour.

**Fonctions:**
*   **Page « Équipe » :** Permet à un Admin d'inviter un nouveau membre, de définir son rôle (Admin, CSM, Closer), de le désactiver (soft-delete) et de le réactiver.
*   **Flux d'acceptation d'invitation :** Permet à un utilisateur invité d'accepter l'invitation, de valider son email et de finaliser la création de son compte.
*   **Connexion sécurisée (Clerk) :** Impose une authentification à deux facteurs (2FA par email) forcée à la première connexion pour tous les membres de l'équipe interne. Les rôles (Admin, CSM, Closer) sont matérialisés dans les claims JWT pour un contrôle d'accès performant.
*   **Scoping par organisation (`orgId`) :** Assure un cloisonnement strict des données pour empêcher tout accès entre différentes organisations.
*   **Audit log (Journal d'audit) :** Garantit la traçabilité des actions sensibles liées à la gestion de l'équipe. Doit tracer les événements suivants pour les rendre visibles dans l'interface d'audit :
    *   Invitation d'un membre (`user.team_member.invited`)
    *   Acceptation de l'invitation (`user.team_member.activated`)
    *   Changement de rôle (`user.role.changed`)
    *   Changement de statut (désactivation/réactivation) (`user.status.changed`)

**Contraintes:**
*   Multi-tenant strict : aucune donnée ne doit pouvoir fuiter entre les organisations.
*   Purge des données J+14 pour les comptes désactivés, à l'exception des documents légaux/financiers.

**Livrables:**
*   Interface utilisateur (UI) de la page « Équipe » permettant la gestion complète des membres (CRUD, rôles, statut).
*   Middleware d'authentification côté backend (NestJS) pour valider les JWT de Clerk et extraire les informations critiques (`orgId`, `role`).
*   Système d'audit log persistant avec une interface de consultation minimale.

### Épique 2 — CRM (fondations)

**Objectif:** construire le référentiel central des clients, fournir une interface opérationnelle pour la gestion du portefeuille, et établir le point d'entrée initial et évolutif pour la création de nouveaux clients.

**Fonctions:**
*   **Page « Clients » :** Affiche la liste de tous les clients dans un tableau avec filtres essentiels (Statut principal, Owner, Date de création), tabs de statut. **Cette page doit inclure un onglet ou un filtre dédié pour isoler les clients en statut "Paiement en attente"**, permettant aux Closers de cibler leurs actions de relance.
*   **Établissement du point d'entrée client :** Met en place le bouton « Ajouter un client » sur la page principale du CRM et le formulaire modal associé. Dans cette première version (périmètre de l'Épique 2), le formulaire permet une création simple (champs essentiels comme nom, email) et l'assignation d'un "Owner". Cette fonctionnalité sert de socle indispensable pour les tests et sera enrichie dans l'Épique 3 avec le flux d'onboarding complet (sélection d'offre, génération de lien, etc.).
*   **Fiche Client (Drawer) :** Offre une vue à 360° d'un client, organisée en onglets :
    *   Infos générales
    *   Projets
    *   Historique d'onboarding
    *   Documents
    *   Tickets
    *   Factures
*   **Export CSV :** Permet à un Admin d'exporter la liste des clients (potentiellement filtrée) au format CSV.
*   **Audit log (Journal d'audit) :** Garantit la traçabilité des actions de gestion clés. Doit tracer les événements suivants pour les rendre visibles dans l'interface d'audit :
    *   Création manuelle d'un client (`client.record.created_manually`)
    *   Mise à jour des informations du client (`client.core_data.updated`)
    *   Changement de statut principal du client (`client.status.changed`)
    *   Export de la liste des clients (`reporting.client_export.requested`)

**Modèle de statuts (périmètre Épique 2):**
*   **Statut Principal :** Définit l'état général d'un client dans le CRM (ex: Prospect → Actif → Inactif → Désactivé). Ce statut peut être géré manuellement par les utilisateurs autorisés via la Fiche Client.
*   **(Ajouté) Déblocage exceptionnel :** Un Admin peut manuellement déverrouiller le module de réservation de kickoff sur le portail d'un client, même si les étapes précédentes de la checklist ne sont pas toutes complétées. Cette action ne marque pas l'étape comme "terminée" mais donne la possibilité au client de la finaliser.
*   *(Note : Le statut détaillé du processus d'onboarding, qui évolue de manière automatisée, est défini et géré dans le cadre de l'Épique 3).*

**Livrables:**
*   Tableau Clients performant (pagination/tri minimal), avec filtres essentiels et export CSV.
*   Fiche Client complète avec sa structure d'onglets et une timeline des événements clés (issue de l'audit log).
*   Bouton « Ajouter un client » et formulaire modal fonctionnel pour la création de base d'un client, prêt à être étendu par l'Épique 3.```

### Épique 3 — Onboarding & Facturation (flux complet)

**Objectif:** automatiser et standardiser le parcours d'un nouveau client, de l'initiation par le Closer jusqu'à l'activation complète du compte, afin de réduire la friction et de garantir une mise en service rapide et fiable.

**Fonctions:**
*   **Gestion des Templates :** Permet à un Admin de créer et gérer le cycle de vie (Brouillon/Publié/Archivé) des templates qui composent l'offre : « Onboarding », « Projets », « Offre commerciale ». Pas de versioning complexe ; un "snapshot" de l'offre est pris au moment de l'envoi.
*   **Initiation du flux d'onboarding :** Via le bouton « Ajouter un client » sur la page principale du CRM, un Closer remplit un formulaire modal. Il y saisit les informations minimales du client et y associe une Offre et un Plan de Paiement. Cette action crée l'enregistrement client avec un statut initial (Invited) et génère le lien d'onboarding unique et sécurisé.
*   **Parcours d'inscription client :** Le client utilise le lien pour créer son compte Clerk, vérifier son email, puis est automatiquement redirigé vers le paiement de sa première facture via un lien Qonto unique.
*   **Orchestration post-paiement :** Après un paiement réussi, le système guide le client à travers une séquence d'étapes définies dans le template (ex: visionnage de vidéo, remplissage de formulaire légal, signature électronique via DigiSigner, réservation de kickoff via Cal.com).
*   **Archivage automatique :** Le système génère et stocke de manière sécurisée les documents clés (facture initiale PDF, contrat signé) dans l'espace de stockage R2 du client.
*   **Audit log (Journal d'audit) :** Assure une traçabilité complète du cycle de vie du client. Doit être conçu pour tracer les événements suivants pour les rendre visibles dans l'interface d'audit :
    *   Génération du lien d'onboarding (`onboarding.link.generated`)
    *   Inscription du client (`client.account.created`)
    *   Paiement réussi / échoué (`payment.succeeded` / `payment.failed`)
    *   Contrat signé (`contract.signed`)
    *   Réservation du Kickoff (`kickoff.booked`)
    *   Activation du compte (`client.account.activated`)
    *   Désactivation / Suppression du compte (`client.status.changed` / `client.record.deleted`)

**Modèle de statuts (périmètre Épique 3):**
*   **Statut d'Onboarding :** Décrit la progression détaillée et automatisée du client dans son parcours d'activation. La séquence est la suivante : `Lien généré` → `Inscription effectuée` → `Paiement validé/échoué` → `Vidéo visionnée` → `Formulaire légal complété` → `Contrat signé` → `Checklist d'onboarding` → `Kick off réservé` → `Terminé`.
*   Le statut principal du client (`Actif`) n'est débloqué que lorsque le statut d'onboarding atteint l'état `Terminé`.

**Contraintes:**
*   Pas de paiements partiels à l'Alpha.
*   Utilisation d'un template de contrat global unique avec fusion de champs dynamiques.

**Livrables:**
*   Page « Templates » avec gestion du cycle de vie (CRUD + statuts).
*   Logique de génération de lien d'onboarding, intégrée au formulaire de création de client.
*   Orchestration des webhooks (Qonto, Cal.com) pour la mise à jour automatique des statuts.
*   Séquence bloquante de formulaires post-paiement pour le client.
*   Archivage automatisé des documents dans R2.

### Épique 4 — Support par Tickets

**Objectif:** fournir un canal de communication structuré et centralisé pour toutes les demandes de support, afin d'assurer la traçabilité des échanges et une résolution efficace des problèmes.

**Fonctions:**
*   **Page « Support » (Cockpit) :** Affiche tous les tickets dans un tableau centralisé avec des filtres basiques (par statut, par assigné). Le tableau doit clairement afficher le client associé à chaque ticket et permettre de filtrer par client.
*   **Création de ticket (Portail Client) :** Permet à un client authentifié de créer un nouveau ticket de support depuis son portail, en y joignant des fichiers si nécessaire.
*   **Fiche Ticket (Cockpit) :** Présente une vue détaillée d'un ticket, incluant le fil de conversation avec le client, les pièces jointes, et une section distincte pour les notes internes (non visibles par le client). La fiche doit afficher les informations du client concerné avec un lien direct vers sa Fiche Client dans le CRM.
*   **Gestion du ticket :** Permet à un CSM de gérer activement le cycle de vie d'un ticket en modifiant son statut (ex: Ouvert, En Cours, Fermé), en changeant sa priorité, et en se l'assignant ou en le réassignant à un autre membre de l'équipe.
*   **Audit log (Journal d'audit) :** Garantit la traçabilité des actions de gestion importantes sur les tickets. Doit tracer les événements suivants pour les rendre visibles dans l'interface d'audit :
    *   Création d'un ticket (`ticket.created`)
    *   Changement de statut (`ticket.status.changed`)
    *   Changement d'assignation (`ticket.assignee.changed`)

**Contraintes:**
*   Le périmètre de l'Alpha se limite aux statuts de base (ex: Ouvert/En Cours/Fermé) et exclut les fonctionnalités avancées comme les SLA, les rapports de performance ou la liaison entre tickets.

**Livrables:**
*   Page « Support » dans le Cockpit avec un tableau de tickets fonctionnel et filtrable.
*   Fiche Ticket complète dans le Cockpit, incluant la conversation, les notes, les pièces jointes et les contrôles pour la gestion du statut et de l'assignation.
*   Formulaire de création de ticket fonctionnel sur le Portail Client.

## 7. Parcours Utilisateurs (Flows)

*   **Closer:** crée client minimal → génère lien d’onboarding → suit progression et notifications (paiement, signature, etc.).
*   **Client :** suit le lien → crée son compte (Clerk) (accès technique au portail d'onboarding est accordé) → paie (Qonto) → vidéo → formulaire légal → signature (DigiSigner) → checklist → réserve kickoff (Cal.com) → le statut d'onboarding passe à "Terminé", ce qui déclenche l'activation métier du compte et le déblocage de toutes les fonctionnalités du portail.
*   **CSM:** consulte Fiche Client, voit checklist et documents archivés, gère tickets et peut débloquer « Kick off réservé » si nécessaire.
*   **Admin:** gère Équipe/Rôles/Org, exports clients/factures, audit log, webhooks échoués.

## 8. Données & Modèle (vue logique)

**Entités principales** (ID lisibles non requis; utiliser IDs préfixés: `org_…`, `usr_…`, `clt_…`, `tplt_…`, `tick_…`, `inv_…`, `file_…`, `mlk_…`):

*   **Organization:** `id`, `name`, `createdAt`.
*   **User (interne):** `id`, `orgId`, `role` (Admin/CSM/Closer), `status`, `createdAt`, `deactivatedAt`.
*   **Client:** `id`, `orgId`, `ownerId`, `identity` (nom, prénom, email), `statusPrincipal`, `statusOnboarding`, `createdAt`.
*   **Template:** `id`, `orgId`, `type` (Onboarding/Projets/Offre), `state` (Brouillon/Publié/Archivé), `contenu structuré` (étapes/items). Snapshot implicite au moment de l’envoi.
*   **OnboardingSession/Timeline:** `id`, `clientId`, `étapes`, `timestamps`, `source` (webhook/calculé).
*   **Invoice/Payment:** `id`, `clientId`, `amount`, `currency`, `status` (Paid/Failed/Pending), `qontoLink`, `pdfFileId`.
*   **Ticket:** `id`, `clientId`, `sujet`, `description`, `type`, `statut`, `priorite`, `assigneeId`, `attachments[]` (fileIds), `messages[]` (publics/privés), `createdAt`.
*   **AuditEvent:** `id`, `orgId`, `actorId`, `type`, `targetId`, `metadata`, `createdAt`.
*   **File (R2):** `id`, `orgId`, `clientId?`, `ticketId?`, `type` (invoice/contract/attachment), `path`, `checksum`, `createdAt`.
*   **MagicLink (onboarding):** `id`, `clientId`, `token`, `expiresAt` (null à l’Alpha), `usedAt?`.

**Règles de rétention:**
*   Soft-delete 14 jours pour comptes désactivés; purge ensuite sauf documents légaux/financiers.

## 9. Intégrations & Webhooks

*   **Clerk:** gestion des sessions/2FA email, rôles en claims; environnements dev/prod.
*   **Qonto:** webhooks consommés — `payment.succeeded`, `payment.failed`; idempotence requise; mise à jour automatique des statuts onboarding; archivage PDF facture initiale vers R2.
*   **DigiSigner:** génération, signature, récupération du contrat signé → archivage R2.
*   **Cal.com:** webhook « booking confirmé » → statut « Kick off réservé ».
*   **Cloudflare R2:** stockage fichiers (factures, contrats, pièces jointes) — source de vérité.

## 10. Sécurité & Conformité

*   **AuthZ multi-tenant strict** (`orgId` partout).
*   **2FA email pour tous** (Alpha). Vérification email obligatoire au 1er login client.
*   **Journalisation d’audit** des actions sensibles (cf. liste épique IAM).
*   **RGPD:** politique détaillée à définir; documents légaux/financiers exclus de la purge J+14.

## 11. Exigences Non-Fonctionnelles

*   **Langue:** FR uniquement à l’Alpha.
*   **Accessibilité:** bonnes pratiques par défaut (shadcn/ui); pas d’audit spécifique.
*   **Performance:** export CSV ≤ 5 min; UI tables réactive (pagination/tri côté serveur).
*   **Observabilité:** page « Audits » (événements système) + logs structurés côté backend.

## 12. Environnements & Déploiement

*   **Environnements:** dev et prod.
*   **Secrets/Config:** variables pour Clerk, Qonto, DigiSigner, Cal.com, R2, Prisma/Neon.
*   **Tests:** Jest priorisé pour logique métier et orchestrations webhooks.

## 13. Définition de Terminé (DoD — Alpha v1)

*   Admin peut inviter un CSM, assigner rôle; 2FA email obligatoire à la première connexion.
*   Closer peut créer un client depuis « Clients », associer une Offre et un plan, générer un lien.
*   Client paie via Qonto, signe via DigiSigner, accède au portail; PDF facture initiale et contrat signés archivés R2.
*   CSM voit dans la Fiche Client que le projet/la checklist sont créés, et peut gérer les tickets.
*   Client peut créer un ticket depuis son portail; CSM/Admin/Closer peuvent répondre.
*   Webhooks Qonto (succès/échec) et Cal.com opérationnels et idempotents.
*   Audit log couvre événements listés.

## 14. Out of Scope (Alpha v1)

*   Reporting/dashboards KPIs.
*   Versioning/snapshot complet des templates.
*   Bulk actions.
*   SLA de support.
*   Packs commerciaux/quotas dynamiques.
*   Fonctionnalités d’IA.
*   Référentiels pays/TVA/devises durcis.

## 15. Glossaire (statuts/termes)

*   **Statut Client (principal):** Invité → Actif → Désactivé.
*   **Statut Onboarding:** Lien généré → Inscription effectuée → **Paiement en attente** → Paiement validé/échoué → Vidéo visionnée → Formulaire légal complété → Contrat signé → Checklist d'onboarding → **En attente de réservation** → Kick off réservé → Terminé.
*   **Statut Template:** Brouillon → Publié → Archivé.
*   **Statut Ticket:** Ouvert → En Cours → Fermé.

## 16. Ouvertures & Hypothèses (à affiner)

*   KPI secondaires (ex: funnel par étape d’onboarding) à cadrer post-Alpha.
*   Politique de retry/idempotence précise par intégration (Qonto/Cal.com/DigiSigner) — à documenter dans l’implémentation.

## 17. [TECH_DEBT] & À Définir Plus Tard

*   **Convention de nommage/structure R2** (répertoires par org/client, fichiers). Priorité: moyenne.
*   **Politique de rétention RGPD détaillée** (durées, anonymisation, droit à l’oubli au-delà de J+14). Priorité: haute.
*   **Registre des risques & contraintes légales** (dont conformité e-sign). Priorité: moyenne.
*   **Politique d’alerte/monitoring** (seuils, canaux) et SLOs. Priorité: moyenne.
*   **Politique d’erreurs:** normalisation des codes/erreurs backend et mapping UI — approfondir.
*   **Hardening sécurité:** rate-limiting, anti-abus, revocation/rotation des magic links (post-Alpha).

## 18. Annexes

*   **Matrice RBAC détaillée** (cf. section 5) — à exporter en documentation d’implémentation.
*   **Diagrammes de séquence** (onboarding, webhooks) — à produire lors du design technique.