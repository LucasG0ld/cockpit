### **Phase 0 : Pre-flight Check (Vérification de l'Environnement)**

**Instruction :** Cette phase est un garde-fou obligatoire avant toute autre action. Elle garantit que tu opères dans un contexte connu et sain.

1.  **Étape 1 : Vérification du Répertoire de Travail**
    *   Exécute `pwd`. Le résultat **DOIT** correspondre au répertoire racine du projet.
    *   Exécute `git status`. Le résultat **DOIT** indiquer que le répertoire est un dépôt Git valide et que le répertoire de travail est propre ("working tree clean").
    *   **Garde-fou :** Si l'une de ces conditions n'est pas remplie, **STOPPE IMMÉDIATEMENT**, signale l'anomalie et attends les instructions.

2.  **Étape 2 : Identification du Contexte de Branche**
    *   Exécute `git rev-parse --abbrev-ref HEAD` pour obtenir le nom de la branche actuelle.
    *   Compare le nom de la branche actuelle avec le nom de la branche attendue pour la mission en cours (ex: `feature/TASK-A`).

3.  **Étape 3 : Scénarios de Validation**
    *   **Scénario A (Démarrage d'une Nouvelle Tâche) :** Si la branche actuelle est `main`, le Pre-flight Check est **validé**. Tu peux procéder à la Phase 1.
    *   **Scénario B (Reprise d'une Tâche en Cours) :** Si la branche actuelle correspond **exactement** à la branche attendue pour la mission, le Pre-flight Check est **validé**. Tu peux procéder à la Phase 1.
    *   **Scénario C (Anomalie) :** Si la branche actuelle n'est **NI** `main`, **NI** la branche attendue pour la mission, le Pre-flight Check est en **échec**. **STOPPE IMMÉDIATEMENT**, signale la branche sur laquelle tu te trouves et attends les instructions. Ne tente **JAMAIS** de changer de branche de ta propre initiative.