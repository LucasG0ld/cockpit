# Micro-Workflow a : Démarrage de Mission

**Objectif :** Ce document est ton protocole de démarrage standard pour toute mission. Sa stricte application garantit que l'environnement est sain, que la mission est parfaitement comprise, et que tu as l'approbation humaine avant de commencer toute modification.

---

### **Phase 1 : Assimilation des Procédures Fondamentales**

**Instruction :** Lis et assimile intégralement le contenu des fichiers de fonctions suivants. Ils contiennent les procédures que tu devras exécuter dans la phase 2.
*   `.windsurf/rules/functions/run_pre_flight_check.md`
*   `.windsurf/rules/functions/run_mission_briefing_and_validation.md`

Une fois ces deux procédures parfaitement assimilées, passe à la phase d'exécution.

---

### **Phase 2 : Exécution Séquentielle de la Mission**

**Instruction :** Exécute les procédures que tu viens d'assimiler dans l'ordre strict suivant.

1.  **Validation du Contexte Doctrinal (Approche Opportuniste) :**
    *   Au début de cette phase, confirme que les neuf doctrines fondamentales sont toujours présentes dans ton contexte de travail récent.
    *   **Si oui,** tu peux continuer.
    *   **Si non (parce que la conversation a été longue ou a dévié),** tu dois d'abord relire le fichier `.windsurf/rules/functions/inject_doctrines_fondamentales.md` avant de procéder à l'étape suivante.

2.  **Exécution du Pre-flight Check :**
    *   Exécute la procédure `run_pre_flight_check`.
    *   **Contexte Requis :** Pour l'étape 2 ("Identification du Contexte de Branche") de cette procédure, la **"branche attendue pour la mission"** est celle spécifiée par l'opérateur dans le briefing de mission initial qui a lancé ce workflow.
    *   **Garde-fou :** Si la procédure `run_pre_flight_check` échoue, elle se stoppera d'elle-même. Présente le rapport d'erreur complet à l'opérateur et attends les instructions.

3.  **Exécution du Briefing et de la Validation :**
    *   Une fois le Pre-flight Check validé avec succès, exécute la procédure `run_mission_briefing_and_validation`.
    *   **Journalisation de l'État Initial (Action Critique) :** Au début de ton "Résumé d'Exécution", ajoute une section "Contexte de Départ" qui inclut le hash du commit de la branche `main` (`git rev-parse main`) sur lequel tu te bases.
    *   **Contexte Requis :** Les documents de référence nécessaires pour cette procédure (tels que `@task.md` ou `_plan.md`) sont ceux fournis dans le prompt de mission de l'opérateur.
    *   **Point de Contrôle :** Cette procédure se termine par un **POINT DE CONTRÔLE HUMAIN**. Soumets le "Résumé d'Exécution" que tu auras généré et **STOPPE**. Attends l'approbation explicite de l'opérateur avant de considérer ce workflow comme terminé.
