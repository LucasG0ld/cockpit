# Procédure de Préparation d'un Audit de Sécurité (Renforcée)

**Contrat d'Interface (Contexte Requis) :**
*Pour fonctionner, cette procédure requiert :*
1.  **`merged_branch_name` :** Le nom de la branche qui doit être auditée.

**Contrat de Sortie (Résultat) :**
*Cette procédure produit et expose les informations suivantes :*
1.  **`report_path` :** Le chemin complet vers le fichier de rapport nouvellement créé.
2.  **`audit_plan` :** La liste des lots de fichiers à analyser.

---

### **Phase 0 : Préparation de l'Environnement de Rapport**

1.  **Création du Répertoire de Rapports :**
    *   Vérifie si le répertoire `reports/security/` existe à la racine du projet.
    *   **Garde-fou :** S'il n'existe pas, crée-le.

2.  **Génération du Chemin du Fichier de Rapport :**
    *   Construis un nom de fichier unique basé sur le nom de la branche et la date/heure actuelle pour éviter les écrasements.
    *   Exemple de nom : `SECURITY_AUDIT_REPORT_[nom-de-la-branche]_[YYYY-MM-DD_HH-mm-ss].md`.
    *   Le `report_path` complet sera donc `reports/security/[nom-du-fichier]`.

3.  **Création et Initialisation du Fichier de Rapport :**
    *   Crée un fichier vide à l'emplacement `report_path`.
    *   **Garde-fou :** Si la création du fichier échoue, **STOPPE IMMÉDIATEMENT** et signale une erreur de permissions système.
    *   Écris un en-tête initial dans le fichier, par exemple :
        ```markdown
        # Rapport d'Audit de Sécurité
        **Branche Auditée :** `[merged_branch_name]`
        **Date de Génération :** `[date/heure actuelle]`
        ---
        ```

### **Phase 1 : Cadrage du Périmètre et Plan d'Audit**

1.  **Identification des Fichiers Modifiés :**
    *   Exécute une commande `git diff` pour lister tous les fichiers modifiés entre `main` et `merged_branch_name`.

2.  **Présentation du Plan d'Audit :**
    *   **SI** aucun fichier n'a été modifié, signale-le à l'opérateur et termine la procédure.
    *   **SINON**, groupe les fichiers en lots logiques (ex: par dossier, par type) et présente ce plan à l'opérateur.
    *   **Message :** "Plan d'audit généré. Le rapport a été créé à l'emplacement `[report_path]`. Voici les lots à analyser : [liste des lots]. Attends votre instruction pour lancer l'analyse du premier lot via le workflow H.2."
