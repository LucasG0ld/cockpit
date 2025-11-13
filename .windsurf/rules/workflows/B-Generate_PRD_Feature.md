---
trigger: manual
---

# Micro-Workflow B : Génération de la Spécification Fonctionnelle (PRD Feature)

**Objectif :** Ce protocole guide la création du **cahier des charges fonctionnel** (`PRD_Feature_...md`). Il traduit la vision de l'épique en User Stories et critères d'acceptation.

**Garde-fou de Responsabilité :** Ce workflow se concentre exclusivement sur le **"QUOI"**. Il ne doit **JAMAIS** être utilisé pour générer un plan d'exécution technique (`_plan.md`) ou des tâches (`TASK-*.md`). Cette responsabilité incombe au **Workflow C**.

---

### **Phase 1 : Assimilation de la Procédure de Spécification**

**Instruction :** Lis et assimile intégralement le contenu du fichier de fonction suivant.

*   [.windsurf/rules/functions/run_prd_feature_specification.md](cci:7://file:///f:/dev/cockpit/.windsurf/rules/functions/run_prd_feature_specification.md:0:0-0:0) **(Version Renforcée)**

Une fois cette procédure parfaitement assimilée, passe à la phase d'exécution.

---

### **Phase 2 : Exécution Séquentielle de la Mission**

**Instruction :** Exécute la procédure que tu viens d'assimiler.

1.  **Validation du Contexte Doctrinal (Approche Opportuniste) :**
    *   Au début de cette phase, confirme que les neuf doctrines fondamentales sont toujours présentes dans ton contexte de travail récent.
    *   **Si oui,** tu peux continuer.
    *   **Si non,** tu dois d'abord relire le fichier [.windsurf/rules/functions/inject_doctrines_fondamentales.md](cci:7://file:///f:/dev/cockpit/.windsurf/rules/functions/inject_doctrines_fondamentales.md:0:0-0:0) avant de procéder.

2.  **Exécution de la Spécification de la Feature :**
    *   Exécute la procédure `run_prd_feature_specification`.
    *   **Instruction de Câblage du Contexte (Action Critique) :** Pour satisfaire le **'Contrat d'Interface'** de cette fonction, tu dois lui fournir les documents de référence qui ont été attachés par l'opérateur au début de cette mission (lors du lancement du workflow `α-Start_Mission`). Tu dois donc récupérer et passer les "paramètres" suivants :
        *   **`prd_global` :** Le document PRD Global, source de vérité maîtresse.
        *   **`epic_charter` :** La Charte d'Épique, qui définit la vision de la fonctionnalité.
    *   **Fin de Workflow :** Ce micro-workflow est considéré comme terminé lorsque la procédure `run_prd_feature_specification` a achevé son exécution complète et s'est mise en attente à son point de contrôle humain final. Suis scrupuleusement ses points d'arrêt internes et ses interactions avec l'opérateur.