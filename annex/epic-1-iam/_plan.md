# Template pour la Génération du Graphe de Dépendances par Jalons (Mermaid)
# Instruction pour l'IA : Remplis ce modèle pour créer la vue d'ensemble stratégique
# de l'épique, décomposée en jalons.

graph TD
    %% ==================================================================
    %% PARTIE 1 : DÉFINITION DES NŒUDS (JALONS ET TÂCHES)
    %% ==================================================================

    %% Jalon 1 (Détaillé) : Liste ici toutes les tâches atomiques du premier jalon.
    subgraph Jalon 1: Backend IAM Socle
        direction LR %% Optionnel : pour une meilleure lisibilité des tâches internes
        subgraph Backend
            BE001[TASK-IAM-BE-001-DB-Schema]
            BE002[TASK-IAM-BE-002-Auth-Guard]
            BE004[TASK-IAM-BE-004-Audit-Service]
            BE005[TASK-IAM-BE-005-Invitations-API]
            BE006[TASK-IAM-BE-006-Activation-Flow]
            BE007[TASK-IAM-BE-007-Role-Management]
            BE008[TASK-IAM-BE-008-Status-Lifecycle]
            BE009[TASK-IAM-BE-009-2FA-Lockout]
        end
        subgraph Frontend
            %% Pas de tâches frontend dans Jalon 1
        end
    end

    %% Jalons Futurs (Conceptuels) : Représente chaque jalon futur par un seul nœud.
    subgraph Jalon 2: Team Management UI
        J2_Node(Jalon 2)
    end
    subgraph Jalon 3: Cross-Tenant UX
        J3_Node(Jalon 3)
    end

    %% ==================================================================
    %% PARTIE 2 : DÉFINITION DES DÉPENDANCES (LIENS)
    %% ==================================================================

    %% Dépendances internes au Jalon 1
    BE001 --> BE002
    BE001 --> BE004
    BE001 --> BE005
    BE001 --> BE006
    BE001 --> BE007
    BE001 --> BE008
    BE001 --> BE009
    BE002 --> BE005
    BE002 --> BE006
    BE002 --> BE007
    BE002 --> BE008
    BE002 --> BE009
    BE004 --> BE005
    BE004 --> BE006
    BE004 --> BE007
    BE004 --> BE008
    BE004 --> BE009
    BE005 --> BE006
    BE005 --> BE007
    BE005 --> BE008
    BE005 --> BE009

    %% Dépendances entre les Jalons
    %% Connecte la ou les dernières tâches du Jalon 1 au nœud conceptuel du Jalon 2
    BE006 --> J2_Node
    BE007 --> J2_Node
    BE008 --> J2_Node
    BE009 --> J2_Node

    %% Ordonnancement global des jalons
    J2_Node --> J3_Node
