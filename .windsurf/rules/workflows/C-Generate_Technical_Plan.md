---
trigger: manual
---

# Micro-Workflow C : Génération du Plan d'Exécution Technique

**Objectif :** Ce protocole transforme une **spécification fonctionnelle validée** (`PRD_Feature_...md`) en un **plan d'exécution technique** (`_plan.md`) et en tâches détaillées (`TASK-*.md`).

**Garde-fou de Responsabilité :** Ce workflow se concentre exclusivement sur le **"COMMENT"**. Il est initié **APRÈS** la validation du livrable du Workflow B. Il est le seul workflow habilité à créer ou modifier le fichier `_plan.md`.

---

### **Phase 1 : Assimilation de la Procédure de Planification**

**Instruction :** Lis et assimile intégralement le contenu du fichier de fonction suivant.

*   [.windsurf/rules/functions/run_feature_decomposition_and_planning.md](cci:7://file:///f:/dev/cockpit/.windsurf/rules/functions/run_feature_decomposition_and_planning.md:0:0-0:0) **(Version Cyclique)**

Une fois cette procédure parfaitement assimilée, passe à la phase d'exécution.

---

### **Phase 2 : Exécution Séquentielle de la Mission**

**Instruction :** Exécute la procédure que tu viens d'assimiler.

1.  **Validation du Contexte Doctrinal (Approche Opportuniste) :**
    *   Au début de cette phase, confirme que les neuf doctrines fondamentales sont toujours présentes dans ton contexte de travail récent.
    *   **Si oui,** tu peux continuer.
    *   **Si non (parce que la conversation a été longue ou a dévié),** tu dois d'abord relire le fichier [.windsurf/rules/functions/inject_doctrines_fondamentales.md](cci:7://file:///f:/dev/cockpit/.windsurf/rules/functions/inject_doctrines_fondamentales.md:0:0-0:0) avant de procéder à l'étape suivante.

2.  **Exécution de la Décomposition et de la Planification :**
    *   Exécute la procédure `run_feature_decomposition_and_planning`.
    *   **Contexte Requis :** La procédure est auto-suffisante. Elle commencera par son diagnostic interne (Phase 0) pour déterminer si elle doit suivre le Scénario A (Création) ou B (Itération).
    *   **Fin de Workflow :** Ce micro-workflow est considéré comme terminé lorsque la fonction a fini son exécution et a affiché le bloc "[POINT DE CONTRÔLE HUMAIN - VALIDATION DU PLAN TECHNIQUE]". **STOPPE** à ce point et attends les instructions de l'opérateur.