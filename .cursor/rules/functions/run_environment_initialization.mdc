### **Phase 2 : Initialisation de l'Environnement (Conditionnelle)**

**Instruction :** Cette phase est **conditionnelle** et dépend du scénario validé en Phase 0. Elle assure que l'environnement est correctement préparé pour le début ou la reprise du travail.


##### **Cas A : Démarrage d'une Nouvelle Tâche (validé sur la branche `main`)**

**Si et seulement si** la Phase 0 a été validée sous le **Scénario A**, exécute les commandes suivantes depuis la racine du projet pour créer et sécuriser la nouvelle branche de travail :

1.  `git pull origin main`
2.  `git checkout -b feature/[ID-du-ticket-description-courte]` (Adapte le nom de la branche comme défini dans le plan).
3.  `git push -u origin feature/[ID-du-ticket-description-courte]`

##### **Cas B : Reprise d'une Tâche en Cours (validé sur une branche de feature)**

**Si** la Phase 0 a été validée sous le **Scénario B** :

*   **Cette phase est ignorée.** Aucune commande n'est nécessaire. L'environnement est déjà sur la bonne branche et prêt pour la reprise du travail. Tu peux procéder directement à la Phase 3.