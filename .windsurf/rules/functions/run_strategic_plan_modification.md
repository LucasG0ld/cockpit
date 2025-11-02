---
trigger: manual
---

### Procédure de Modification de Plan Stratégique (Renforcée)

**Contrat d'Interface (Contexte Requis) :**
*Pour fonctionner, cette procédure requiert les informations suivantes de la part du micro-workflow qui l'appelle :*
1.  **`path_to_plan` :** Le chemin complet et exact vers le fichier `_plan.md` à modifier.
2.  **`change_request_details` :** Le texte complet de la demande de changement formulée par l'opérateur.

---

**Instruction :** Cette procédure guide la modification chirurgicale d'un plan de travail existant. Elle garantit que le plan stratégique et les tâches détaillées restent parfaitement synchronisés.

---

#### **Phase 1 : Analyse d'Impact et Proposition de Modification**

1.  **Analyse d'Impact :** En te basant sur le `change_request_details`, analyse les conséquences de la modification sur le graphe de dépendances du `path_to_plan`.

2.  **Proposition de Modification (sur `_plan.md` uniquement) :** Présente une proposition de modification `AVANT` / `APRÈS` pour le fichier `_plan.md`, avec une justification claire.

**[POINT DE CONTRÔLE HUMAIN N°1 - VALIDATION STRATÉGIQUE]**
**STOP.** Soumets ta proposition. Attends la validation explicite de l'opérateur avant de continuer.

---

#### **Phase 2 : Application et Propagation des Changements**

**Instruction :** N'exécute cette phase qu'après avoir reçu la validation de l'opérateur.

1.  **Action (Étape 1 - Mise à Jour du Plan Stratégique) :**
    *   Applique les modifications validées directement dans le fichier spécifié par `path_to_plan`.
    *   **Garde-fou :** Si cette opération d'écriture échoue, **STOPPE IMMÉDIATEMENT** et signale l'erreur précise à l'opérateur.

2.  **Action (Étape 2 - Propagation aux Tâches Détaillées) :**
    *   En te basant sur le `_plan.md` mis à jour, effectue les opérations de synchronisation :
        *   **Ajout de tâche :** Crée le nouveau fichier `task.md` dans `tasks/[version]/[feature-name]/`.
            *   **Garde-fou :** Si la création échoue, **STOPPE IMMÉDIATEMENT** et signale l'erreur.
        *   **Modification de tâche :** Met à jour le fichier `task.md` correspondant.
            *   **Garde-fou :** Si la mise à jour échoue, **STOPPE IMMÉDIATEMENT** et signale l'erreur.
        *   **Suppression de tâche :** Supprime le fichier `task.md` correspondant.
            *   **Garde-fou :** Si la suppression échoue, **STOPPE IMMÉDIATEMENT** et signale l'erreur.

---

#### **Phase 3 : Confirmation de la Synchronisation**

1.  **Rapport Final :** Produis un rapport final concis confirmant les actions effectuées avec succès.

**[POINT DE CONTRÔLE HUMAIN N°2 - FIN DE PROCÉDURE]**
La modification est terminée et documentée.