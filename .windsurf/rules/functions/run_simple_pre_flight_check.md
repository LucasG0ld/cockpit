### Procédure de Pré-vérification Simplifiée (Renforcée)

**Instruction :** Cette procédure valide de manière **objective** que tu opères à la racine d'un projet valide avant de lancer une commande de type "outil".

---

#### **Phase 0 : Validation du Contexte par Fichiers Sentinelles**

1.  **Vérification de la Racine du Projet :**
    *   **Action :** Vérifie l'existence simultanée des deux "sentinelles" suivantes dans le répertoire actuel :
        1.  Le fichier `package.json`.
        2.  Le répertoire `.git`.
    *   **Garde-fou :** Si l'un de ces deux éléments (ou les deux) est manquant, l'exécution n'a pas lieu à la racine d'un projet Node.js/Git valide. **STOPPE IMMÉDIATEMENT** et signale l'anomalie : "Erreur de pré-vérification : le répertoire actuel n'est pas la racine du projet."

2.  **Vérification de l'État du Dépôt (Confirmation Secondaire) :**
    *   **Action :** Exécute la commande `git status`.
    *   **Garde-fou :** Si la commande retourne une erreur (ex: "fatal: not a git repository", ce qui ne devrait pas arriver si l'étape 1 a réussi mais reste une sécurité), **STOPPE IMMÉDIATEMENT** et signale l'anomalie.

---

#### **Phase 1 : Confirmation du Succès**

1.  **Rapport Final :**
    *   Si toutes les vérifications ci-dessus réussissent, informe l'opérateur.
    *   *Message : "Pré-vérification simple réussie. Le contexte du projet est validé. Prêt à continuer."*