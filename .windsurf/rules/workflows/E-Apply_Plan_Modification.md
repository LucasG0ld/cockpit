# Micro-Workflow E : Application d'une Modification de Plan (Renforcé)

**Objectif :** Ce protocole orchestre l'exécution de la modification d'un plan technique. Tu l'exécutes après avoir reçu l'approbation du "Résumé d'Exécution" à la fin du workflow `α-Start_Mission`, qui a établi le contexte et validé ta compréhension de la demande de changement.

---

### **Phase 1 : Assimilation de la Procédure de Modification**

**Instruction :** Lis et assimile intégralement le contenu du fichier de fonction suivant.

*   `.windsurf/rules/functions/run_strategic_plan_modification.md` **(Version Renforcée)**

Une fois cette procédure parfaitement assimilée, passe à la phase d'exécution.

---

### **Phase 2 : Exécution Séquentielle de la Mission**

**Instruction :** Exécute la procédure que tu viens d'assimiler.

1.  **Validation du Contexte Doctrinal (Approche Opportuniste) :**
    *   Au début de cette phase, confirme que les neuf doctrines fondamentales sont toujours présentes dans ton contexte de travail récent.
    *   **Si oui,** tu peux continuer.
    *   **Si non,** tu dois d'abord relire le fichier `.windsurf/rules/functions/inject_doctrines_fondamentales.md` avant de procéder.

2.  **Exécution de la Modification du Plan Stratégique :**
    *   Exécute la procédure `run_strategic_plan_modification`.
    *   **Instruction de Câblage du Contexte (Action Critique) :** Pour satisfaire le **'Contrat d'Interface'** de cette fonction, tu dois lui fournir les informations du contexte de mission actuel. Ce contexte a été établi et validé via le "Résumé d'Exécution" à la fin du workflow `α-Start_Mission`. Tu dois donc extraire de ce contexte validé les deux "paramètres" suivants :
        *   **`path_to_plan` :** Le chemin complet vers le fichier `_plan.md` concerné.
        *   **`change_request_details` :** Le détail de la demande de modification formulée par l'opérateur.
    *   **Fin de Workflow :** Ce micro-workflow est terminé lorsque la procédure `run_strategic_plan_modification` a achevé son cycle de vie complet, incluant son rapport final. Suis scrupuleusement ses points d'arrêt internes.