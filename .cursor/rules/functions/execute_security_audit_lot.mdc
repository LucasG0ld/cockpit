# Procédure d'Exécution d'un Lot d'Audit de Sécurité (Renforcée)

**Contrat d'Interface (Contexte Requis) :**
*Pour fonctionner, cette procédure requiert :*
1.  **`lot_files` :** La liste des chemins de fichiers à analyser.
2.  **`lot_identifier` :** Le nom du lot en cours d'analyse.
3.  **`report_path` :** Le chemin complet vers le fichier de rapport.

**Instruction :** Cette procédure analyse un lot de fichiers et met à jour le rapport.

---

### **Phase 0 : Validation des Prérequis**

1.  **Vérification des Fichiers Source :**
    *   Pour chaque fichier dans la liste `lot_files`, vérifie qu'il existe.
    *   **Garde-fou :** Si un ou plusieurs fichiers sont introuvables, **STOPPE IMMÉDIATEMENT** et signale une erreur de périmètre : "Impossible de trouver les fichiers suivants du lot `[lot_identifier]`: [liste des fichiers manquants]".

<!-- SUPPRESSION : Le garde-fou sur l'existence du fichier de rapport est supprimé. La procédure de préparation (setup_security_audit) garantit désormais son existence. -->

---

### **Phase 1 : Analyse Résiliente du Lot**

1.  **Analyse Fichier par Fichier :**
    *   Pour chaque fichier de `lot_files`:
        *   **Tente de lire le contenu du fichier.**
        *   **Garde-fou (Erreur de Lecture) :** Si la lecture échoue, ne t'arrête pas. Consigne une erreur spécifique pour ce fichier (ex: "ERREUR : Impossible de lire le fichier `[chemin/du/fichier]`") et passe au fichier suivant.
        *   Si la lecture réussit, analyse le contenu en utilisant la **Check-list d'Audit Inquisitoriale**.
        *   Consigne toutes les vulnérabilités et erreurs de lecture identifiées.

2.  **Check-list d'Audit Inquisitoriale :**
    *   **Validation des Entrées (OWASP A03:2021 - Injection) :**
        *   **Q1 :** Ce code reçoit-il des données d'une source non fiable (payload HTTP, etc.) ?
        *   **Q2 :** Si oui, **où** sont-elles validées (type, format) ? Cite la ligne/fonction.
        *   **Q3 :** Sont-elles utilisées dans une requête DB ou une commande système ? Si oui, sont-elles correctement échappées/paramétrées ?
    *   **Contrôle d'Accès (OWASP A01:2021 - Broken Access Control) :**
        *   **Q4 :** Ce code expose-t-il une route ou une fonction modifiant des données sensibles ?
        *   **Q5 :** Si oui, **quel garde-fou** (`Guard`) protège cet accès ? Cite la ligne.
        *   **Q6 :** La logique de contrôle vérifie-t-elle systématiquement le rôle **ET** l'appartenance (`orgId`) ?
    *   **Gestion des Données Sensibles (OWASP A02:2021 - Cryptographic Failures) :**
        *   **Q7 :** Le code manipule-t-il des informations sensibles (clés API, PII) ?
        *   **Q8 :** Si oui, y a-t-il la moindre trace de ces informations en clair dans le code ou les logs ?
    *   **Gestion des Erreurs (OWASP A05:2021 - Security Misconfiguration) :**
        *   **Q9 :** Les blocs `catch` renvoient-ils des messages d'erreur détaillés (`stack traces`) à l'utilisateur final ?

---

### **Phase 2 : Mise à Jour Standardisée du Rapport**

1.  **Mise à Jour du Rapport :**
    *   Ouvre le fichier `report_path` en mode "ajout" (append).
    *   Ajoute un titre pour le lot : `### Lot : [lot_identifier]\n\n`.
    *   **Si aucune vulnérabilité ou erreur n'a été trouvée**, ajoute la ligne : `- RAS. Aucune vulnérabilité évidente identifiée dans ce lot.\n`.
    *   **Pour chaque vulnérabilité ou erreur trouvée**, ajoute une entrée en utilisant le **template de rapport strict** suivant :
        ```markdown
        **Fichier :** `[chemin/complet/du/fichier]`
        **Ligne :** (Approximative) [numéro de ligne]
        **Type de Vulnérabilité :** [ex: OWASP A01 - Broken Access Control]
        **Question d'Audit :** [ex: Q6 - La logique vérifie-t-elle le rôle ET l'orgId ?]
        **Description :** [Description claire et concise de la faille identifiée.]
        ```
    *   **Garde-fou :** Si l'écriture dans le fichier échoue, **STOPPE IMMÉDIATEMENT**.

2.  **Rapport de Progression Intermédiaire :**
    *   Informe l'opérateur de la fin de l'analyse du lot.
    *   **Message :** "Analyse du `[lot_identifier]` terminée. J'ai identifié [nombre] vulnérabilité(s) et j'ai mis à jour le rapport `[report_path]`. J'attends votre instruction pour continuer."
