# Micro-Workflow H.1 : Planification d'un Audit de Sécurité

**Objectif :** Ce protocole est le point d'entrée pour lancer un audit de sécurité post-développement. Sa seule responsabilité est d'orchestrer la préparation de l'environnement, le cadrage du périmètre et la présentation du plan d'audit à l'opérateur.

---

### **Phase 1 : Assimilation de la Procédure de Préparation**

**Instruction :** Lis et assimile intégralement le contenu du fichier de fonction suivant.

*   `.windsurf/rules/functions/setup_security_audit.md` 


Une fois cette procédure parfaitement assimilée, passe à la phase d'exécution.

---

### **Phase 2 : Exécution Séquentielle de la Mission**

**Instruction :** Exécute la procédure que tu viens d'assimiler.

1.  **Validation du Contexte Doctrinal (Approche Opportuniste) :**
    *   Au début de cette phase, confirme que les neuf doctrines fondamentales sont toujours présentes dans ton contexte de travail récent.
    *   **Si oui,** tu peux continuer.
    *   **Si non,** tu dois d'abord relire le fichier `.windsurf/rules/functions/inject_doctrines_fondamentales.md` avant de procéder.

2.  **Exécution de la Préparation de l'Audit :**
    *   Exécute la procédure `setup_security_audit`.
    *   **Instruction de Câblage du Contexte (Action Critique) :** Pour satisfaire le **'Contrat d'Interface'** de cette fonction, tu dois lui fournir l'information suivante, extraite du prompt de l'opérateur qui a lancé ce workflow :
        *   **`merged_branch_name` :** Le nom de la branche qui doit être auditée.
    *   **Fin de Workflow :** Ce micro-workflow est considéré comme terminé lorsque la procédure `setup_security_audit` a achevé son exécution (soit en s'arrêtant sur une erreur ou un périmètre vide, soit en présentant le plan d'audit et le chemin du rapport). **STOPPE** à ce point et attends l'instruction de l'opérateur pour lancer le workflow suivant (`H.2-Execute_Audit_Lot.md`).