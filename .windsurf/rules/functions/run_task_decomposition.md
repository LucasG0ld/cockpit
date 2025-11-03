---
trigger: manual
---

# Procédure de Décomposition d'une Tâche Complexe (Renforcée)

**Contrat d'Interface (Contexte Requis) :**
*Pour fonctionner, cette procédure requiert :*
1.  **`complex_task_path` :** Le chemin complet vers le fichier `.md` de la tâche à décomposer.
2.  **`reason` :** La justification fournie par l'agent ou l'opérateur (ex: "La tâche mélange plusieurs responsabilités critiques").

---

### Phase 1 : Analyse et Proposition de Décomposition

1.  **Analyse de la Tâche Source :**
    *   Lis et analyse le contenu du fichier `complex_task_path`.
    *   Identifie les différentes responsabilités logiques en examinant les sections "High-Level Objective" et "Low-Level Steps". Recherche les verbes d'action forts qui impliquent des domaines distincts (ex: "Mettre à jour la BDD", "Appeler une API externe", "Gérer un workflow").

2.  **Élaboration du Plan de Décomposition :**
    *   Construis un plan structuré qui propose une série de nouvelles tâches atomiques.
    *   Pour chaque nouvelle tâche proposée, définis :
        *   Un **Nouvel ID** suivant la convention `[ID-PARENT]-A`, `[ID-PARENT]-B`, etc.
        *   Un **Titre** clair et focalisé.
        *   Son **Objectif Principal**.
        *   Les **Étapes Spécifiques** qu'elle héritera de la tâche parente.
        *   Ses **Dépendances** par rapport aux autres nouvelles tâches.

3.  **Présentation du Plan pour Validation Humaine :**
    *   Présente le plan de décomposition à l'opérateur.
    *   **Exemple de sortie pour `TASK-IAM-BE-007` :**
        > "La tâche est complexe. Voici ma proposition de décomposition en 3 tâches atomiques, conformément à nos conventions :
        >
        > **1. Tâche `TASK-IAM-BE-007-A` : API de Mise à Jour du Rôle**
        >    - **Objectif :** Créer la route d'API sécurisée pour mettre à jour le rôle d'un membre et émettre l'événement d'audit.
        >    - **Dépendances :** Celles de la tâche parente.
        >
        > **2. Tâche `TASK-IAM-BE-007-B` : Invalidation de Session Externe**
        >    - **Objectif :** Intégrer l'appel à l'API Clerk pour invalider la session d'un utilisateur après un changement de rôle.
        >    - **Dépendances :** `TASK-IAM-BE-007-A`.
        >
        > **3. Tâche `TASK-IAM-BE-007-C` : Gestion des Réassignations**
        >    - **Objectif :** Spécifier et implémenter la logique de réassignation des responsabilités suite à un changement de rôle.
        >    - **Dépendances :** `TASK-IAM-BE-007-A`.
        >
        > **Validez-vous ce plan ? Répondez par 'oui' pour procéder à la création des fichiers."**

**[POINT DE CONTRÔLE HUMAIN]**
**STOP.** Attends la validation explicite de l'opérateur ("oui").

---

### Phase 2 : Exécution de la Décomposition (sur validation)

1.  **Génération des Nouveaux Fichiers de Tâches :**
    *   Pour chaque tâche validée dans le plan :
        *   Crée un nouveau fichier `.md` en utilisant la convention de nommage validée (ex: `TASK-IAM-BE-007-A.md`).
        *   Utilise le template de tâche atomique pour structurer le nouveau fichier.
        *   Peuple le fichier avec les informations définies dans le plan (ID, Titre, Objectif, Étapes, Dépendances, etc.). Copie les méta-données pertinentes de la tâche parente (labels, priorité...).
        *   **Garde-fou :** Si la création d'un fichier échoue, **STOPPE** et signale l'erreur.

2.  **Mise à Jour de la Tâche Parente :**
    *   Ouvre le fichier `complex_task_path`.
    *   Modifie la ligne `status:` pour la mettre à **`decomposed`**.
    *   Ajoute une nouvelle section en haut du fichier, sous les méta-données :
        ```markdown
        ---
        **AVERTISSEMENT :** Cette tâche a été décomposée et ne doit plus être exécutée.
        
        **Tâches Enfants :**
        - `TASK-IAM-BE-007-A`
        - `TASK-IAM-BE-007-B`
        - `TASK-IAM-BE-007-C`
        ---
        ```
    *   Sauvegarde les modifications du fichier parent.
    *   **Garde-fou :** Si la modification du fichier parent échoue, **STOPPE** et signale l'erreur.

---

### Phase 3 : Rapport Final

1.  **Confirmation de la Création :**
    *   Liste les chemins complets des nouveaux fichiers de tâches qui ont été créés.
    *   Confirme que la tâche parente a été mise à jour avec le statut `decomposed` et la liste des tâches enfants.
    *   **Message :** "Décomposition terminée avec succès. Les nouvelles tâches atomiques sont créées et prêtes à être planifiées. La tâche parente a été archivée."