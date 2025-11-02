### Procédure d'Audit de la Dette Technique (Renforcée)

**Contrat d'Interface (Contexte Requis) :**
*Cette fonction est autonome.*

---

**Instruction :** Cette procédure gère le processus complet d'audit de la dette technique.

---

#### **Phase 1 : Exécution du Scan**

1.  **Choix du Mode de Scan (Interaction Humaine Robuste) :**
    *   Pose la question : "Voulez-vous lancer un scan **différentiel** (`diff`) ou **complet** (`all`) ?".
    *   Attends la réponse de l'opérateur.
    *   **Garde-fou :** Si la réponse n'est **NI** `diff` **NI** `all`, répète la question en précisant les options valides : "Entrée invalide. Veuillez répondre par `diff` ou `all`." Continue de demander jusqu'à obtenir une réponse valide.

2.  **Lancement du Script de Scan :**
    *   Exécute la commande correspondant à la réponse **validée** de l'opérateur.
    *   **Garde-fou :** Si l'exécution échoue, **STOPPE IMMÉDIATEMENT** et signale l'erreur.

3.  **Validation de la Génération du Rapport :**
    *   Identifie le **fichier le plus récemment modifié** dans le dossier `reports/tech-debt/`.
    *   **Garde-fou :** Si le script s'est terminé mais qu'aucun fichier de rapport n'a été généré ou modifié récemment, **STOPPE** et signale l'anomalie.

---

#### **Phase 2 : Analyse et Présentation de la Synthèse**

1.  **Lecture et Analyse du Rapport :**
    *   Lis le contenu du fichier de rapport identifié.
    *   Extrais le nombre total de dettes, et les comptes pour **MAJOR** et **MINOR**.
    *   **Garde-fou :** Si le rapport ne peut pas être lu ou parsé, **STOPPE** et signale une erreur de lecture du rapport.

2.  **Présentation de la Synthèse à l'Opérateur :**
    *   Affiche la synthèse en utilisant le template suivant :
    *   *Message :*
        > "Analyse terminée. Le scan **[différentiel/complet]** a identifié **[nombre total]** points de dette technique.
        > *   **[nombre]** dettes sont marquées comme **MAJOR**.
        > *   **[nombre]** dettes sont marquées comme **MINOR**.
        >
        > Le rapport complet, incluant les descriptions détaillées et les liens directs vers le code, a été généré ici : `[chemin/complet/vers/le/rapport.md]`."

---

#### **Phase 3 : Handoff et Clôture**

1.  **Handoff à l'Opérateur Humain :**
    *   Informe l'opérateur que ta mission est terminée.
    *   *Message : "Le rapport de dette technique a été généré et sa synthèse présentée. Ma mission d'audit est terminée. J'attends vos prochaines instructions."*

**[POINT DE CONTRÔLE HUMAIN]**
**STOP.**
