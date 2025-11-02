### Procédure de Sauvegarde de Contexte (Renforcée)

**Contrat d'Interface (Contexte Requis) :**
*Pour fonctionner, cette procédure requiert les informations suivantes :*
1.  **`task_id_blocked` :** L'identifiant de la tâche actuellement bloquée.
2.  **`task_id_prerequisite` :** L'identifiant de la tâche prérequise.

---

**Instruction :** Cette procédure sécurise tout le travail en cours dans une branche temporaire.

---

#### **Phase 0 : Validation du Contexte Initial**

1.  **Vérification de la Branche Actuelle :**
    *   Exécute `git rev-parse --abbrev-ref HEAD` pour obtenir le nom de la branche actuelle.
    *   **Garde-fou :** Le nom de la branche **DOIT** commencer par `feature/`. Si la branche actuelle est `main`, `develop`, ou commence par `wip/` ou `fix/`, etc., le contexte est invalide. **STOPPE IMMÉDIATEMENT** et signale l'erreur à l'opérateur.

---

#### **Phase 1 : Sauvegarde du Travail en Cours**

1.  **Confirmation du Lancement :**
    *   Informe l'opérateur du début du processus.
    *   *Message : "Procédure de sauvegarde de contexte initiée. Sécurisation du travail sur la tâche [task_id_blocked]."*

2.  **Création d'une Branche de Travail en Cours (WIP) :**
    *   Crée une nouvelle branche locale nommée `wip/[task_id_blocked]`.
    *   **Commande :** `git checkout -b wip/[task_id_blocked]`
    *   **Garde-fou :** Si cette commande échoue, **STOPPE IMMÉDIATEMENT** et signale l'erreur.

3.  **Commit de Sauvegarde :**
    *   **Commande :** `git add .`
    *   **Commande :** `git commit -m "WIP: Stashing work on [task_id_blocked] to address dependency [task_id_prerequisite]"`
    *   **Garde-fou :** Si le commit échoue (ex: rien à commiter), signale-le à l'opérateur mais continue le processus.

4.  **Synchronisation de la Branche de Sauvegarde :**
    *   **Commande :** `git push -u origin wip/[task_id_blocked]`
    *   **Garde-fou :** Si cette commande échoue, **STOPPE IMMÉDIATEMENT**. C'est une erreur critique.

5.  **Confirmation de la Sauvegarde :**
    *   Informe l'opérateur que la sauvegarde est terminée avec succès.
    *   *Message : "Sauvegarde terminée. Le travail en cours a été poussé sur la branche `wip/[task_id_blocked]`."*