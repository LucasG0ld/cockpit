### Procédure de Cycle de Remédiation de Sécurité (Renforcée)

**Contrat d'Interface (Contexte Requis) :**
*Pour fonctionner, cette procédure requiert les informations suivantes :*
1.  **`branch_name` :** Le nom de la branche de travail actuelle (ex: `feature/TASK-123`).
2.  **`audit_report_path` :** Le chemin complet vers le rapport d'audit contenant les vulnérabilités.
3.  **`vulnerability_ids_to_fix` :** Une liste des identifiants spécifiques des vulnérabilités à corriger, fournis par l'opérateur.

---

**Instruction :** Ce processus te guide pour corriger les vulnérabilités de sécurité identifiées lors d'un audit, tout en garantissant qu'aucune régression n'est introduite.

---

#### **Phase 0 : Préparation et Validation des Entrées**

1.  **Validation du Rapport d'Audit :**
    *   Vérifie que le fichier spécifié par `audit_report_path` existe et est lisible.
    *   **Garde-fou :** Si le fichier est introuvable ou illisible, **STOPPE IMMÉDIATEMENT** et signale l'anomalie.

2.  **Validation des Cibles de Correction :**
    *   Parse le rapport d'audit et vérifie que **chaque identifiant** dans la liste `vulnerability_ids_to_fix` correspond bien à une entrée existante dans le rapport.
    *   **Garde-fou :** Si un ou plusieurs identifiants sont introuvables, **STOPPE IMMÉDIATEMENT** et signale l'erreur à l'opérateur (ex: "L'identifiant de vulnérabilité 'VULN-003' n'a pas été trouvé dans le rapport d'audit.").

---

#### **Phase 1 : Cycle de Correction Itératif**

**Instruction :** Pour chaque vulnérabilité dans la liste `vulnerability_ids_to_fix`, exécute les actions suivantes.

1.  **Localise et Comprends :**
    *   Lis les détails de la vulnérabilité dans le rapport d'audit (fichier, ligne, description).

2.  **Corrige le Code :**
    *   Modifie le code source pour éliminer la vulnérabilité identifiée, en respectant les bonnes pratiques de sécurité.

3.  **Adapte les Tests (si nécessaire) :**
    *   Si ta correction modifie une logique métier, mets à jour les tests unitaires ou d'intégration correspondants pour refléter le nouveau comportement sécurisé.

---

#### **Phase 2 : Vérification Post-Correction (Non-Régression)**

1.  **Exécution des Tests Locaux :**
    *   Une fois que **toutes** les vulnérabilités ont été corrigées, lance l'ensemble de la suite de tests locaux.
    *   **Commande :** `npm run test` (ou équivalent).

2.  **Validation du Succès des Tests :**
    *   **Garde-fou (Critique) :** Si un seul test échoue, cela indique une régression ou une correction incorrecte. **STOPPE IMMÉDIATEMENT**. Signale l'échec des tests et fournis les journaux d'erreurs à l'opérateur. Ne continue en aucun cas.

---

#### **Phase 3 : Confirmation de Fin de Cycle**

1.  **Rapport Final :**
    *   Si toutes les corrections ont été appliquées et que tous les tests locaux passent, informe l'opérateur que le cycle de remédiation est terminé avec succès.
    *   *Message : "Cycle de remédiation de sécurité terminé. [Nombre] vulnérabilités ont été corrigées. Tous les tests locaux passent, confirmant qu'aucune régression n'a été introduite. L'environnement est prêt à ré-entrer dans le pipeline de validation (Quality Gate). J'attends vos instructions."*