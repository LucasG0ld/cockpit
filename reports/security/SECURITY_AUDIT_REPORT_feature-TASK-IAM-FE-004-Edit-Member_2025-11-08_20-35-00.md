# Rapport d'Audit de Sécurité
**Branche Auditée :** `feature/TASK-IAM-FE-004-Edit-Member`
**Date de Génération :** `2025-11-08 20:35:00`
---

### Lot : Lot 1: Feature - Edit Member UI

**Fichier :** `apps/frontend/src/app/(dashboard)/team/components/team-table.tsx`
**Ligne :** (Approximative) 106
**Type de Vulnérabilité :** OWASP A01 - Broken Access Control
**Question d'Audit :** Q5 - Quel garde-fou protège cet accès ?
**Description :** Le menu d'actions (modifier le rôle, désactiver) est visible et utilisable par n'importe quel utilisateur consultant la table. Il n'y a pas de contrôle côté client pour s'assurer que seul un utilisateur avec les privilèges suffisants (par exemple, un ADMIN) puisse voir et déclencher ces actions sensibles. Bien que la protection finale doive être sur l'API, l'interface ne devrait pas proposer des actions non autorisées.

