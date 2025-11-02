# Procédure de Mise à Jour du Statut d'une Tâche

**Contrat d'Interface (Contexte Requis) :**
*Pour fonctionner, cette procédure requiert :*
1.  **`task_file_path` :** Le chemin complet vers le fichier de tâche à modifier.
2.  **`new_status` :** Le nouveau statut à appliquer (ex: "completed").

**Instruction :** Ce processus modifie de manière sécurisée le statut d'une tâche dans son fichier source.

---

### **Phase 0 : Validation des Prérequis**

1.  **Vérification du Fichier Cible :**
    *   Vérifie que le fichier spécifié par `task_file_path` existe.
    *   **Garde-fou :** Si le fichier est introuvable, **STOPPE IMMÉDIATEMENT** et signale l'erreur : "Impossible de trouver le fichier de tâche à l'emplacement : `[task_file_path]`".

### **Phase 1 : Modification du Statut**

1.  **Lecture et Modification :**
    *   Lis le contenu du fichier `task_file_path`.
    *   Localise la ligne contenant `status: "..."` dans la section frontmatter (en haut du fichier).
    *   Remplace cette ligne par `status: "[new_status]"`.
    *   **Garde-fou :** Si la clé `status` n'est pas trouvée dans le frontmatter, **STOPPE** et signale l'anomalie : "La structure du fichier de tâche `[task_file_path]` est invalide, la clé 'status' est introuvable."

2.  **Sauvegarde des Modifications :**
    *   Écrase le fichier `task_file_path` avec le nouveau contenu modifié.
    *   **Garde-fou :** Si l'écriture échoue (ex: problème de permissions), **STOPPE** et signale l'erreur.

### **Phase 2 : Confirmation**

1.  **Rapport Final :**
    *   Informe l'opérateur que la mise à jour a été effectuée avec succès.
    *   **Message :** "Le statut du fichier de tâche `[task_file_path]` a été mis à jour à `[new_status]`."