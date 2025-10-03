# Template pour la Génération du Graphe de Dépendances par Jalons (Mermaid)

# Instruction pour l'IA : Remplis ce modèle pour créer la vue d'ensemble stratégique
# de l'épique, décomposée en jalons.

graph TD
    %% ==================================================================
    %% PARTIE 1 : DÉFINITION DES NŒUDS (JALONS ET TÂCHES)
    %% ==================================================================

    %% Jalon 1 (Détaillé) : Liste ici toutes les tâches atomiques du premier jalon.
    subgraph Jalon 1: [Titre du premier jalon]
        direction LR %% Optionnel : pour une meilleure lisibilité des tâches internes
        subgraph Backend
            A1[TASK-ID-BE-001-Description]
            A2[...]
        end
        subgraph Frontend
            B1[TASK-ID-FE-001-Description]
            B2[...]
        end
    end

    %% Jalons Futurs (Conceptuels) : Représente chaque jalon futur par un seul nœud.
    %% N'explose pas ces jalons en tâches détaillées à ce stade.
    subgraph Jalon 2: [Titre du deuxième jalon]
        J2_Node(Jalon 2)
    end
    subgraph Jalon 3: [Titre du troisième jalon]
        J3_Node(Jalon 3)
    end
    %% ... ajouter d'autres jalons si nécessaire

    %% ==================================================================
    %% PARTIE 2 : DÉFINITION DES DÉPENDANCES (LIENS)
    %% Connecte les nœuds pour montrer les relations.
    %% ==================================================================

    %% Dépendances internes au Jalon 1
    A1 --> A2
    A2 --> B2 %% Dépendance croisée

    %% Dépendances entre les Jalons
    %% Connecte la ou les dernières tâches du Jalon 1 au nœud conceptuel du Jalon 2
    B2 --> J2_Node
    J2_Node --> J3_Node