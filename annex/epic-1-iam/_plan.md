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
            BE005A[TASK-IAM-BE-005-A-Resend-Integration]
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
    %% Jalon 2 (Détaillé) : Tâches Frontend pour la gestion d'équipe.
    subgraph Jalon 2: Team Management UI
        direction LR
        subgraph Frontend
            FE001[TASK-IAM-FE-001-UI-Components]
            FE002[TASK-IAM-FE-002-Team-View]
            FE003[TASK-IAM-FE-003-Invite-Member]
            FE004[TASK-IAM-FE-004-Edit-Member]
            FE005[TASK-IAM-FE-005-Audit-Trail]
            FE006[TASK-IAM-FE-006-State-Management]
            FE007[TASK-IAM-FE-007-API-Integration]
            FE007A[TASK-IAM-FE-007-A-UI-Permissions]
            FE008[TASK-IAM-FE-008-Clerk-Integration-Fix]
            FE009[TASK-IAM-FE-009-Invite-Acceptance]
            FE010[TASK-IAM-FE-010-Reassignment-Flow]
            FE011[TASK-IAM-FE-011-Access-Control-UI]
            FE012[TASK-IAM-FE-012-User-Menu]
        end
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

    %% Nouvelle chaîne de dépendance via l'intégration email
    BE005 --> BE005A
    BE005A --> BE006
    BE005A --> BE007
    BE005A --> BE008
    BE005A --> BE009

    %% Dépendances internes au Jalon 2
    %% La configuration de Clerk est un prérequis pour toutes les vues et intégrations
    FE008 --> FE002
    FE008 --> FE003
    FE008 --> FE004
    FE008 --> FE005
    FE008 --> FE007

    %% Les composants UI sont des prérequis pour les vues
    FE001 --> FE002
    FE001 --> FE003
    FE001 --> FE004
    FE001 --> FE005

    %% L'intégration API dépend de toutes les fonctionnalités et du state management
    FE006 --> FE007
    FE002 --> FE007
    FE003 --> FE007
    FE004 --> FE007
    FE005 --> FE007
    
    %% La gestion des permissions est la dernière étape
    FE007 --> FE007A

    %% Dépendances entre les Jalons
    %% Le Backend (Jalon 1) est un prérequis pour l'intégration API (Jalon 2)
    BE005 --> FE003
    BE006 --> FE003
    BE007 --> FE004
    BE008 --> FE004
    BE004 --> FE005

    %% La dernière tâche d'intégration du Jalon 2 débloque le Jalon 3
    FE007A --> J3_Node

    %% Tâches issues de l'Audit (Complétude Jalon 2)
    %% Le flux d'invitation public nécessite le client API et Clerk
    FE007 --> FE009
    FE008 --> FE009

    %% La réassignation est une extension de l'édition de membre avec des vérifications API
    FE004 --> FE010
    FE007 --> FE010

    %% Les pages d'erreur globales sont déclenchées par l'API ou les guards
    FE007 --> FE011
    FE007A --> FE011

    %% Le menu utilisateur nécessite l'auth Clerk
    FE008 --> FE012

    %% Ces tâches sont requises pour clôturer le Jalon 2
    FE009 --> J3_Node
    FE010 --> J3_Node
    FE011 --> J3_Node
    FE012 --> J3_Node

    %% Ordonnancement global des jalons
    J2_Node --> J3_Node
