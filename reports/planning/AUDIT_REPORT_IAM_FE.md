# Audit de Complétude : Épique 1 Frontend (IAM)

**Date :** 2025-11-20
**Auteur :** Antigravity (Architecte Frontend & PO Technique)
**Sujet :** Analyse des écarts entre les PRDs et le plan d'exécution (Tâches `TASK-IAM-FE-*`).

---

## 1. Synthèse de l'Analyse

Le plan d'exécution actuel pose des fondations solides pour l'interface d'administration (Page Équipe, Audit) et l'intégration technique de base (Clerk, API). Cependant, **il est incomplet sur deux aspects critiques du parcours utilisateur** :

1.  **Le parcours de l'invité (Guest Flow) :** Il n'existe aucune tâche pour gérer l'arrivée d'un nouvel utilisateur via un lien d'invitation (US-3). Sans cela, les invitations envoyées ne mènent nulle part.
2.  **La gestion des dépendances métiers (Reassignment Flow) :** Les tâches de modification/désactivation (US-4, US-5) traitent ces actions comme des opérations atomiques simples, ignorant la règle métier bloquante qui impose de réassigner les clients d'un CSM avant de le désactiver.

Le plan couvre bien le "Happy Path" de l'Admin, mais manque de robustesse sur les cas limites et les flux externes.

---

## 2. Matrice de Couverture

| User Story | Description | État | Tâches Associées | Analyse / Manque |
| :--- | :--- | :--- | :--- | :--- |
| **US-1** | Connexion & 2FA | ⚠️ Partiel | `TASK-IAM-FE-008` | Le middleware et la page de login sont prévus. *Manque : Gestion spécifique des erreurs 2FA et UX de verrouillage (peut être géré par Clerk natif, à vérifier).* |
| **US-2** | Invitation Membre | ✅ Couvert | `TASK-IAM-FE-003`, `TASK-IAM-FE-007-API` | Formulaire et logique d'envoi couverts. |
| **US-3** | **Acceptation Invitation** | ❌ **Manquant** | *Aucune* | **CRITIQUE.** Aucune page n'est prévue pour accueillir l'utilisateur qui clique sur le lien d'invitation. |
| **US-4** | Changement Rôle | ⚠️ Partiel | `TASK-IAM-FE-004`, `TASK-IAM-FE-007-API` | UI de changement prévue. *Manque : Flux de réassignation si le changement de rôle impacte des clients.* |
| **US-5** | Désactivation | ⚠️ Partiel | `TASK-IAM-FE-004`, `TASK-IAM-FE-007-API` | UI de confirmation simple prévue. *Manque : Blocage si clients actifs & Modal de Réassignation.* |
| **US-6** | Multi-tenant (Secu) | ✅ Couvert | `TASK-IAM-FE-007-A`, `TASK-IAM-FE-008` | Permissions UI et Middleware couverts. |
| **US-7** | Audit Log | ✅ Couvert | `TASK-IAM-FE-005`, `TASK-IAM-FE-006` | Vue et Store couverts. |

---

## 3. Propositions de Tâches Manquantes

Voici les 4 tâches critiques à ajouter au plan pour atteindre 100% de couverture.

### Proposition 1 : Parcours d'Acceptation d'Invitation

*   **ID Suggéré :** `TASK-IAM-FE-009-Invite-Acceptance`
*   **Titre :** Invitation Acceptance Page & Flow
*   **High-Level Objective :** Créer la page publique d'atterrissage pour les liens d'invitation qui valide le token et redirige l'utilisateur vers le flux d'inscription/connexion Clerk.
*   **User Story :** US-3 (Acceptation d'invitation)
*   **End State :**
    *   `app/(auth)/invite/accept/page.tsx` : Page qui récupère le token d'URL.
    *   Logique de validation du token auprès de l'API (via `api-client`).
    *   Gestion des états d'erreur : "Lien expiré", "Déjà utilisé".
    *   Redirection vers la page Sign-up Clerk avec l'email pré-rempli en cas de succès.

### Proposition 2 : Flux de Réassignation des Ressources

*   **ID Suggéré :** `TASK-IAM-FE-010-Reassignment-Flow`
*   **Titre :** Resource Reassignment Modal & Logic
*   **High-Level Objective :** Implémenter le flux bloquant lors de la désactivation d'un CSM ou d'un changement de rôle critique, forçant l'Admin à réassigner les clients actifs avant de valider l'action.
*   **User Story :** US-4 (Changement rôle), US-5 (Désactivation)
*   **End State :**
    *   `app/(dashboard)/team/components/reassign-clients-dialog.tsx` : Modale listant les clients impactés et permettant de choisir un nouveau CSM.
    *   Mise à jour de `TASK-IAM-FE-004` (Edit Member) pour intégrer cette étape de vérification avant l'appel API de désactivation.
    *   Logique dans le store pour vérifier la "désactivabilité" d'un membre (check préalable API).

### Proposition 3 : Gestion Globale des Erreurs d'Accès

*   **ID Suggéré :** `TASK-IAM-FE-011-Access-Control-UI`
*   **Titre :** Global 403/404 Error Pages & Handling
*   **High-Level Objective :** Créer les pages d'erreur explicites pour les accès refusés (403 - Mauvaise Org/Rôle) et s'assurer que l'utilisateur n'est pas juste bloqué face à une page blanche ou un toast générique.
*   **User Story :** US-6 (Multi-tenant), US-1 (Sécurité)
*   **End State :**
    *   `app/not-found.tsx` : Page 404 personnalisée (Design System).
    *   `app/forbidden.tsx` (ou équivalent géré par routing) : Page "Accès Refusé" expliquant pourquoi (ex: "Vous n'avez pas les droits Admin").
    *   Intercepteur global (dans `api-client` ou QueryClient) pour rediriger vers ces pages en cas d'erreur API correspondante.

### Proposition 4 : Menu Utilisateur & Déconnexion

*   **ID Suggéré :** `TASK-IAM-FE-012-User-Menu`
*   **Titre :** User Menu & Logout Integration
*   **High-Level Objective :** Intégrer le composant de menu utilisateur (ou `<UserButton />` de Clerk) dans le layout principal pour permettre à l'utilisateur de consulter son profil et surtout de **se déconnecter**.
*   **User Story :** US-1 (Connexion) & UX Standard
*   **End State :**
    *   `components/layout/user-nav.tsx` : Composant affichant l'avatar de l'utilisateur.
    *   Intégration du bouton de déconnexion (via `useClerk().signOut()` ou composant natif).
    *   Mise à jour de `app/(dashboard)/layout.tsx` (ou d'un composant `Header`) pour inclure ce menu de manière persistante sur toutes les pages.

---

## 4. Améliorations Recommandées (Non-bloquantes)

*   **Configuration Clerk (US-1) :** Vérifier explicitement que la configuration du projet Clerk force bien le 2FA à la première connexion et gère le verrouillage après 5 tentatives. Si cela nécessite du code custom (ex: `user.update({ mfa: true })` après le premier login), une tâche technique `TASK-IAM-FE-012-Clerk-MFA-Enforcement` devra être créée.
*   **Feedback UI "Idempotence" (US-2) :** S'assurer que le composant `Toast` peut afficher des messages d'information/warning distincts des erreurs (bleu/jaune vs rouge) pour le cas où l'on invite un utilisateur déjà invité ("Email déjà invité il y a moins de 24h").
