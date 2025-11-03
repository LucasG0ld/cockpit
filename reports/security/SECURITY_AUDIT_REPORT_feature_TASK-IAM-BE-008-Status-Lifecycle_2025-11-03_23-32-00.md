# Rapport d'Audit de Sécurité
**Branche Auditée :** `feature/TASK-IAM-BE-008-Status-Lifecycle`
**Date de Génération :** `2025-11-03 23:32:00`
---
### Lot : Lot 1: apps/backend

**Fichier :** `apps/backend/src/memberships/memberships.controller.ts`
**Ligne :** (Approximative) 31
**Type de Vulnérabilité :** OWASP A01 - Broken Access Control
**Question d'Audit :** Q6 - La logique de contrôle vérifie-t-elle systématiquement le rôle ET l'appartenance (orgId) ?
**Description :** Le guard `ClerkAuthGuard` et le décorateur `@Roles(UserRole.Admin)` assurent la protection de la route. Le `membershipsService` valide ensuite l'appartenance à l'organisation. La protection semble robuste.

**Fichier :** `apps/backend/src/memberships/memberships.service.ts`
**Ligne :** (Approximative) 96
**Type de Vulnérabilité :** OWASP A01 - Broken Access Control
**Question d'Audit :** Q6 - La logique de contrôle vérifie-t-elle systématiquement le rôle ET l'appartenance (orgId) ?
**Description :** La méthode `updateStatus` vérifie bien que le `membership.organizationId` correspond à l' `orgId` de l'acteur authentifié, empêchant un administrateur de modifier des appartenances hors de son organisation.

**Fichier :** `apps/backend/src/memberships/dto/update-status.dto.ts`
**Ligne :** (Approximative) 5
**Type de Vulnérabilité :** OWASP A03:2021 - Injection
**Question d'Audit :** Q2 - Si oui, où sont-elles validées (type, format) ?
**Description :** Le DTO utilise `@IsEnum(UserStatus)` et `@IsNotEmpty()`, ce qui garantit que la charge utile est toujours l'une des valeurs `Active` ou `Disabled`, prévenant les injections ou les manipulations de statut inattendues.

**Fichier :** `apps/backend/src/clerk/clerk.service.ts`
**Ligne :** (Approximative) 10
**Type de Vulnérabilité :** OWASP A02:2021 - Cryptographic Failures
**Question d'Audit :** Q8 - Si oui, y a-t-il la moindre trace de ces informations en clair dans le code ou les logs ?
**Description :** La clé secrète `CLERK_SECRET_KEY` est chargée depuis les variables d'environnement (`process.env.CLERK_SECRET_KEY`) et n'est pas exposée en clair dans le code, ce qui est une bonne pratique.

### Lot : Lot 2: Tests

- RAS. Aucune vulnérabilité évidente identifiée dans ce lot.


