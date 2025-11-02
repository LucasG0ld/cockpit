# Micro-Workflow D.3 : Validation Finale et Durcissement

**Objectif :** Ce protocole orchestre le pipeline de validation. Il est conçu comme une machine à états qui s'exécute jusqu'à ce que le code soit prouvé, de qualité validée et sécurisé, ou jusqu'à ce qu'une intervention humaine soit requise.

---

### **Phase 1 : Assimilation des Procédures**

**Instruction :** Lis et assimile intégralement le contenu des fichiers suivants.
*   `.windsurf/rules/functions/run_quality_gate.md`
*   `.windsurf/rules/workflows/H.1-Plan_Security_Audit.md`
*   `.windsurf/rules/workflows/H.2-Execute_Audit_Lot.md`
*   `.windsurf/rules/functions/run_security_remediation_cycle.md`
*   `.windsurf/rules/functions/request_human_review_for_merge.md`

---

### **Phase 2 : Exécution de la Machine à États de Validation**

**Instruction :** Tu vas maintenant entrer dans le pipeline de validation. Tu exécuteras cette séquence d'étapes en entier. Si une étape de remédiation est nécessaire, tu recommenceras automatiquement cette séquence depuis le début après avoir appliqué les corrections.

1.  **Validation du Contexte Doctrinal :**
    *   Exécute la validation opportuniste du contexte doctrinal au début de cette mission.

2.  **Garde-fou de Confinement de Branche (Action Critique) :**
    *   **Contexte Requis :** Le nom de la "branche à auditer" fourni par l'opérateur.
    *   **Action :** Exécute `git rev-parse --abbrev-ref HEAD`.
    *   **Condition :** Le résultat DOIT correspondre exactement à la branche à auditer.
    *   **Garde-fou :** Si la branche actuelle n'est pas la bonne, **STOPPE IMMÉDIATEMENT** et signale l'anomalie.

3.  **DÉBUT DE LA BOUCLE DE VALIDATION**

    a. **ÉTAPE A : QUALITY GATE (SÉCURISÉ)**
    *   **Garde-fou (Pré-Exécution) :** Exécute `git status`. Le répertoire de travail DOIT être propre. Si ce n'est pas le cas, **STOPPE** et signale une anomalie d'état.
    *   Exécute `run_quality_gate.md`.
    *   **Analyse du Rapport et de l'État Post-Exécution :** Exécute `git status` à nouveau.
        *   **Si le Quality Gate échoue,** présente le rapport d'erreurs.
        *   **Si des modifications ont été générées** (par `lint --fix`), signale-le explicitement à l'opérateur en listant les fichiers modifiés.
    *   **Point de Décision Humain :** L'opérateur évaluera le rapport. Il te donnera l'une des deux instructions suivantes :
        1.  **"Les erreurs sont critiques. Lance la remédiation."** -> Dans ce cas, tu passes directement à l'étape 5 (Gestion de la Remédiation).
        2.  **"Les erreurs sont acceptables. Poursuis le pipeline."** -> Dans ce cas, tu ignores l'échec et passes directement à l'Étape B.
    *   Si le Quality Gate réussit, passe directement à l'Étape B.

    b. **ÉTAPE B : PLANIFICATION DE L'AUDIT DE SÉCURITÉ**
    *   Exécute `H.1-Plan_Security_Audit.md`.
    *   Attends la validation du plan par l'opérateur.

    c. **ÉTAPE C : EXÉCUTION DE L'AUDIT DE SÉCURITÉ**
    *   Sur instruction de l'opérateur, exécute `H.2-Execute_Audit_Lot.md` pour chaque lot.

4.  **POINT DE DÉCISION STRATÉGIQUE**
    *   Après l'analyse du dernier lot, évalue le rapport d'audit.
    *   **SI** aucune vulnérabilité critique n'a été trouvée :
        *   **Action :** Passe directement à l'**ÉTAPE FINALE : HANDOFF**.
    *   **SI** des vulnérabilités critiques ont été trouvées :
        *   **Action :** Présente à l'opérateur le **"Briefing de Décision de Remédiation"** (avec les Options 1 et 2).
        *   **STOPPE** et attends la décision de l'opérateur.

5.  **GESTION DE LA REMÉDIATION (SÉCURISÉE ET ATOMIQUE)**
    *   **SI** l'opérateur choisit l'Option 1 (Lancer la remédiation) :
        *   Exécute la fonction de correction (`run_security_remediation_cycle.md` ou une passe de `lint --fix`).
        *   **Garde-fou (Post-Correction) :** Exécute `git status` pour identifier tous les fichiers modifiés par la remédiation.
        *   **Commit Atomique de Correction :**
            *   `git add [liste des fichiers modifiés]`
            *   `git commit -m "fix(quality): application des corrections post-quality gate"`
        *   **Information :** Informe l'opérateur que les corrections ont été committées sur la branche de feature.
        *   **annonce à l'opérateur que tu relances le cycle de validation complet**, puis **recommence l'exécution de ce workflow depuis "DÉBUT DE LA BOUCLE DE VALIDATION"**.
    *   **SI** l'opérateur choisit l'Option 2 (Nouveau Chat) :
        *   Ta mission dans ce chat est terminée. **STOPPE**.

6.  **ÉTAPE FINALE : HANDOFF, FUSION ET FINALISATION**
    *   **Action 1 : Handoff pour Revue Humaine**
        *   Exécute la procédure `request_human_review_for_merge.md`.
        *   Attends l'instruction de fusion de l'opérateur.

    *   **Action 2 : Fusion et Finalisation (sur instruction)**
        *   Une fois l'instruction **"Le travail est validé. Procède à la fusion dans main."** reçue, exécute les procédures suivantes dans l'ordre :
            1.  `run_controlled_merge.md`
            2.  `run_update_task_status.md` (avec le statut "completed")
            3.  `run_post_merge_cleanup.md`

    *   **Action 3 : Rapport d'Exécution**
        *   Après le nettoyage, exécute la procédure de génération de rapport de la mission (création du fichier `EXECUTION_REPORT` et commit sur `main`).

    *   **Fin de Workflow :** Ce micro-workflow est terminé. **STOPPE**.
