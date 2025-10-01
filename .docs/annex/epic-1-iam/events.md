# Dictionnaire d'Événements - Épique 1 : IAM (Socle)

Ce document est la source de vérité unique pour tous les événements liés à l'épique 1 (IAM). Il représente la "boîte à outils" des actions que le système peut tracer pour cette fonctionnalité. Tous les noms d'événements doivent suivre la convention `domaine.objet.action` en `snake_case`.

Notes de modélisation:
- `actorId` référence une `Identity` (et non une Membership). Le contexte d'organisation est capturé via `organizationId`.
- `metadata` peut inclure `membershipId` lorsque pertinent (ex: changements de rôle/statut au niveau d'une Membership).

| Nom de l'Événement | Déclencheur | Description | Exemple de Metadata |
| :--- | :--- | :--- | :--- |
| **`user.team_member.invited`** | Un administrateur envoie une invitation avec succès depuis la page "Équipe". | Trace l'invitation d'un nouveau membre dans une organisation. | `{ "invitedEmail": "new@member.com", "assignedRole": "CSM" }` |
| **`user.team_member.activated`** | Un utilisateur invité clique sur le lien, complète son inscription et vérifie son email avec succès. | Trace l'activation réussie d'un compte suite à une invitation. | `{ "activatedUserId": "usr_...", "initialRole": "CSM" }` |
| **`user.role.changed`** | Un administrateur modifie le rôle d'un membre de l'équipe (y compris lui-même). | Trace un changement de permissions pour un utilisateur. | `{ "from": "CSM", "to": "Admin" }` |
| **`user.status.changed`** | Un administrateur désactive (soft-delete) ou réactive un membre de l'équipe. | Trace un changement de statut d'un compte utilisateur. | `{ "from": "Active", "to": "Disabled" }` |