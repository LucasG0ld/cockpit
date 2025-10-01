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
  id        String   @id @default(cuid()) // Préfixe: "org_"
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  users        User[]
  invitations  Invitation[]
  auditEvents  AuditEvent[]
}

model User {
  id             String     @id @default(cuid()) // Préfixe: "usr_"
  clerkId        String     @unique // ID essentiel pour lier à Clerk.
  email          String     @unique
  role           UserRole
  status         UserStatus @default(Active)
  createdAt      DateTime   @default(now())
  updatedAt      DateTime   @updatedAt

  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])

  sentInvitations Invitation[] @relation("Inviter")
  auditEvents     AuditEvent[] @relation("Actor")
}

model Invitation {
  id             String           @id @default(cuid()) // Préfixe: "ivt_"
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
  invitedBy      User             @relation("Inviter", fields: [invitedById], references: [id])
}

model AuditEvent {
  id             String   @id @default(cuid()) // Préfixe: "evt_"
  eventType      String   // ex: "user.team_member.invited"
  metadata       Json?
  createdAt      DateTime @default(now())

  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])

  actorId        String
  actor          User         @relation("Actor", fields: [actorId], references: [id])

  targetId       String? // ID de l'entité affectée (ex: "usr_xyz").
}