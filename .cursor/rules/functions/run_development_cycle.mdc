### Phase 3 : Développement et Itérations

**Instruction :** Tu es maintenant sur la branche de feature, qui est synchronisée avec le serveur distant. Commence le cycle de développement.

1.  **Cycle TDD :**
    *   Écrire le Test d'Intégration qui échoue (RED).
    *   Écrire le Code d'Implémentation pour faire passer le test (GREEN).
    *   **Contrôle de Conformité Atomique :** Pendant l'écriture du code, respecte scrupuleusement les règles de la directive Atomic Design. **Vérifie que la logique est bien placée au bon niveau** (ex: pas de logique métier dans les atomes/molécules, pas de style de positionnement dans les composants réutilisables).
    *   Refactorer le code pour améliorer sa clarté si nécessaire, en s'assurant que les tests passent toujours.
2.  **Commit et Push Sécurisés :** Après chaque avancée significative et fonctionnelle, exécute la séquence suivante :
    *   **Garde-fou Pré-Commit :** Exécute `git status`. La sortie de cette commande est la source de vérité pour l'indexation.
    *   `git add [fichiers listés par git status]`
    *   `git commit -m "feat: [décris l'avancée]"` (ou `fix:`, `chore:`, etc.)
    *   `git push`
3.  **Règle d'Escalade :** Après 3 tentatives infructueuses pour faire passer un test, **STOP**. Signale le blocage et demande de l'aide humaine.