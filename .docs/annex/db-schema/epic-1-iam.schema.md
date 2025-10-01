# annex/alpha-v1/db-schema/epic-1-iam.schema.md

## SCHÉMA DE BASE DE DONNÉES - ÉPIQUE 1 : IAM (SOCLE)
# Ce document est le "plan de construction" structurel et la source de vérité unique
# pour l'état de la base de données à la fin de l'épique 1.

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// --- Enums ---
// Définit les états possibles pour garantir la cohérence des données.

enum UserRole {
  Admin
  CSM
  Closer
  Temporaire // Rôle assigné après réactivation ou invitation "à configurer plus tard".
}

enum UserStatus {
  Active
  Disabled // Pour le soft-delete.
}

enum InvitationStatus {
  Pending
  Accepted
  Expired
}


// --- Tables ---

model Organization {
  id           String   @id @default(cuid())
  externalId   String   @unique // Identifiant exposé dans les JWT (ex: "org_<ulid>")
  name         String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  memberships  Membership[]
  invitations  Invitation[]
  auditEvents  AuditEvent[]
}

// Identity globale (unique par clerkId/email), multi-organisation via Membership
model Identity {
  id            String   @id @default(cuid())
  clerkId       String   @unique
  email         String   @unique
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  memberships   Membership[]
  sentInvites   Invitation[] @relation("Inviter")
  auditEvents   AuditEvent[] @relation("Actor")
}

model Invitation {
  id             String           @id @default(cuid())
  email          String
  role           UserRole
  status         InvitationStatus @default(Pending)
  token          String           @unique
  expiresAt      DateTime
  createdAt      DateTime         @default(now())
  updatedAt      DateTime         @updatedAt

  organizationId String
  organization   Organization     @relation(fields: [organizationId], references: [id])

  invitedById    String
  invitedBy      Identity         @relation("Inviter", fields: [invitedById], references: [id])
}

model AuditEvent {
  id             String   @id @default(cuid())
  eventType      String   // ex: "user.team_member.invited"
  metadata       Json?
  createdAt      DateTime @default(now())

  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])

  actorId        String
  actor          Identity     @relation("Actor", fields: [actorId], references: [id])

  targetId       String? // ID de l'entité affectée (ex: membershipId).
}

// Appartenance d'une Identity à une Organization, porte rôle/statut/context
model Membership {
  id             String     @id @default(cuid())
  role           UserRole
  status         UserStatus @default(Active)
  disabledAt     DateTime?
  createdAt      DateTime   @default(now())
  updatedAt      DateTime   @updatedAt

  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])

  identityId     String
  identity       Identity     @relation(fields: [identityId], references: [id])

  @@unique([organizationId, identityId])
}

// Politique de suppression: RESTRICT (pas de cascade). Les suppressions doivent être explicites au niveau applicatif.