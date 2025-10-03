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
            BE002[TASK-IAM-BE-002-Auth-Guard\n(note: JWT Clerk HS256, req.auth, 401/403)]
            BE003[TASK-IAM-BE-003-Tenant-Enforcement]
            BE008[TASK-IAM-BE-008-Audit-Service]
            BE004[TASK-IAM-BE-004-Invitations-API]
            BE005[TASK-IAM-BE-005-Role-API]
            BE006[TASK-IAM-BE-006-Status-API]
            BE007[TASK-IAM-BE-007-2FA-and-Lockout]
        end
        subgraph Frontend
            %% Pas de tâches frontend dans Jalon 1
        end
    end

    %% Jalons Futurs (Conceptuels) : Représente chaque jalon futur par un seul nœud.
    %% N'explose pas ces jalons en tâches détaillées à ce stade.
    subgraph Jalon 2: Composants UI (Atoms & Molecules)
        J2_Node(Jalon 2)
    end
    subgraph Jalon 3: Assemblage UI & Routes
        J3_Node(Jalon 3)
    end
    %% ... ajouter d'autres jalons si nécessaire

    %% ==================================================================
    %% PARTIE 2 : DÉFINITION DES DÉPENDANCES (LIENS)
    %% Connecte les nœuds pour montrer les relations.
    %% ==================================================================

    %% Dépendances internes au Jalon 1 (Backend)
    BE001 --> BE002
    BE001 --> BE003
    BE002 --> BE003
    BE001 --> BE008
    BE001 --> BE004
    BE002 --> BE004
    BE003 --> BE004
    BE008 --> BE004
    BE001 --> BE005
    BE002 --> BE005
    BE003 --> BE005
    BE008 --> BE005
    BE001 --> BE006
    BE002 --> BE006
    BE003 --> BE006
    BE008 --> BE006
    BE001 --> BE007
    BE002 --> BE007

    %% Dépendances entre les Jalons
    %% Connecte la ou les dernières tâches du Jalon 1 au nœud conceptuel du Jalon 2
    BE004 --> J2_Node
    BE006 --> J2_Node
    BE008 --> J2_Node

    %% Jalon 1 vers Jalon 3 (dépendances directes nécessaires à l'assemblage UI)
    BE002 --> J3_Node
    BE003 --> J3_Node
    BE005 --> J3_Node

    %% Ordonnancement global des jalons
    J2_Node --> J3_Node

