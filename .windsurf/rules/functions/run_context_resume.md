### Procédure de Reprise de Contexte (Renforcée)

**Contrat d'Interface (Contexte Requis) :**
*Pour fonctionner, cette procédure requiert les informations suivantes :*
1.  **`task_id_blocked` :** L'identifiant de la tâche qui doit être reprise.

---

**Instruction :** Cette procédure restaure un travail précédemment mis en pause.

---

#### **Phase 0 : Validation du Contexte Initial**

1.  **Vérification de la Branche Actuelle :**
    *   Exécute `git rev-parse --abbrev-ref HEAD`.
    *   **Garde-fou :** La branche **DOIT** être `main`. Si non, **STOPPE IMMÉDIATEMENT** et signale l'anomalie.

---

#### **Phase 1 : Restauration du Contexte de Travail**

1.  **Retour sur la Branche de Travail Initiale :**
    *   **Commande :** `git checkout feature/[task_id_blocked]`
    *   **Garde-fou :** Si cette commande échoue, **STOPPE IMMÉDIATEMENT**.

2.  **Mise à Jour avec la Dépendance Résolue :**
    *   **Commande :** `git pull origin main`
    *   **Garde-fou :** En cas de conflit, **STOPPE IMMÉDIATEMENT**.

3.  **Récupération du Travail en Cours :**
    *   **Commande :** `git merge wip/[task_id_blocked]`
    *   **Garde-fou :** En cas de conflit, exécute `git merge --abort` et **STOPPE IMMÉDIATEMENT**.

---

#### **Phase 2 : Nettoyage Post-Reprise (sur instruction)**

1.  **Demande de Confirmation pour Nettoyage :**
    *   Pose la question : "Le travail en cours a été récupéré. La branche de sauvegarde `wip/[task_id_blocked]` n'est plus utile. Puis-je la supprimer en local et sur le dépôt distant ?"

2.  **Exécution du Nettoyage (Conditionnelle) :**
    *   **Si et seulement si** la réponse de l'opérateur est "oui" :
        *   **Commande :** `git branch -d wip/[task_id_blocked]`
            *   **Garde-fou :** Si cette commande échoue, signale l'erreur à l'opérateur mais continue, car la suppression distante est plus importante.
        *   **Commande :** `git push origin --delete wip/[task_id_blocked]`
            *   **Garde-fou :** Si cette commande échoue, **STOPPE IMMÉDIATEMENT** et signale l'échec critique de la suppression de la branche distante.
    *   Confirme que le nettoyage a été effectué avec succès.

---

#### **Phase 3 : Confirmation de Reprise**

1.  **Rapport Final :**
    *   Informe l'opérateur que le contexte est restauré.
    *   *Message : "Reprise de contexte terminée. Je suis prêt à continuer le travail sur la tâche [task_id_blocked]."