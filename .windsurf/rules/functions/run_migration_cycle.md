# Fonction : Exécution d'un Cycle de Migration de Base de Données

**Objectif :** Exécuter de manière sécurisée et validée un cycle de migration de base de données avec Prisma. Ce cycle ne suit pas un TDD classique mais un processus de "Génération -> Validation -> Commit".

---

### **Phase 1 : Génération et Application de la Migration**

**Instruction :** Tu es sur la branche de feature dédiée à cette migration.

1.  **Modification du Schéma :** Applique les changements requis au fichier `apps/backend/prisma/schema.prisma` conformément au cahier des charges de la tâche.

2.  **Mise à Jour du Client Prisma :**
    *   **Commande :** `pnpm prisma generate`
    *   **Garde-fou :** Si cette commande échoue, **STOPPE** immédiatement. Présente l'erreur à l'opérateur et attends les instructions.

3.  **Création et Application de la Migration :**
    *   **Contexte Requis :** Le nom de la migration, fourni dans le fichier `@task.md` ou par l'opérateur.
    *   **Commande :** `pnpm prisma migrate dev --name "[nom-de-la-migration]"`
    *   **Garde-fou :** Si cette commande échoue, **STOPPE** immédiatement. Une migration échouée peut laisser la base de données dans un état instable. Présente l'erreur complète à l'opérateur et attends les instructions de remédiation.

### **Phase 2 : Validation Humaine Manuelle**

**Instruction :** La migration a été appliquée localement. Tu dois maintenant obtenir la validation de l'opérateur.

1.  **Lancement de l'Outil de Vérification :**
    *   **Commande :** Lance `pnpm prisma studio`.
    *   **Message à l'opérateur :** "Prisma Studio a été lancé. La base de données locale reflète maintenant la nouvelle migration. Veuillez vérifier manuellement que le schéma et les données sont conformes aux attentes."

2.  **Point de Contrôle Humain :**
    *   **Attente :** Attends scrupuleusement la confirmation explicite de l'opérateur.
    *   **Question :** Pose la question suivante : **"La migration est-elle validée ? Répondez par 'oui' pour procéder au commit, ou 'non' pour arrêter le processus."**
    *   **Garde-fou :** Si la réponse est "non", la fonction se termine en échec. **STOPPE** et attends les instructions de l'opérateur pour la remédiation.

### **Phase 3 : Finalisation (Commit et Push)**

**Instruction :** Cette phase n'est exécutée que si la validation humaine ("oui") a été reçue.

1.  **Commit des Changements :**
    *   **Commande :** `git add .`
    *   **Commande :** `git commit -m "feat(db): [nom-de-la-migration]"`

2.  **Push vers le Dépôt Distant :**
    *   **Commande :** `git push`
    *   **Garde-fou :** Si cette commande échoue, **STOPPE**. Signale l'erreur à l'opérateur et attends ses instructions.

### **Phase 4 : Fin de la Fonction**

**Instruction :** Une fois le push réussi, la mission de cette fonction est terminée.

*   **Message :** "La fonction `run_migration_cycle` est terminée avec succès. La migration a été appliquée, validée et poussée sur la branche de feature."
