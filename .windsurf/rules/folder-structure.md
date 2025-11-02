---
trigger: manual
---

# Structure des Fichiers du Projet ClientFlow v1.0

# À L'AGENT IA : 
# Ta source de vérité principale pour le développement est le dossier de contexte de la version active (ex: `alpha-v1-context/`).
# Les règles qui régissent ton travail se trouvent dans `.windsurf/rules/`.
# Ne fais JAMAIS référence aux fichiers dans le dossier `.docs/` pour l'exécution d'une tâche.

---

### Arborescence du Projet

/
├── .windsurf/                        # Cerveau IA + rules
│   └── rules/
│       ├── functions/              # Unités procédurales atomiques. Briques de base de la logique.
│       │   ├── execute_security_audit_lot.md
│       │   ├── inject_doctrines_fondamentales.md
│       │   ├── request_human_review_for_merge.md
│       │   ├── run_context_resume.md
│       │   ├── run_context_save.md
│       │   ├── run_controlled_merge.md
│       │   ├── run_development_cycle.md
│       │   ├── run_environment_initialization.md
│       │   ├── run_feature_decomposition_and_planning.md
│       │   ├── run_migration_cycle.md
│       │   ├── run_mission_briefing_and_validation.md
│       │   ├── run_post_merge_cleanup.md
│       │   ├── run_prd_feature_specification.md
│       │   ├── run_prd_global_cocreation.md
│       │   ├── run_pre_flight_check.md
│       │   ├── run_quality_gate.md
│       │   ├── run_security_remediation_cycle.md
│       │   ├── run_simple_pre_flight_check.md
│       │   ├── run_strategic_plan_modification.md
│       │   ├── run_tech_debt_audit.md
│       │   ├── run_update_task_status.md
│       │   └── setup_security_audit.md
│       │
│       ├── workflows/              # Orchestrateurs légers. Séquencent les `functions` pour exécuter les processus.
│       │   ├── A-Generate_PRD_Global.md
│       │   ├── B-Generate_PRD_Feature.md
│       │   ├── C-Generate_Technical_Plan.md
│       │   ├── D.2-Execute_Development_Cycle.md
│       │   ├── D.3-Validation_and_Hardening.md
│       │   ├── E-Apply_Plan_Modification.md
│       │   ├── F-Pause_Current_Task.md
│       │   ├── F-Resume_Paused_Task.md
│       │   ├── G-Run_Tech_Debt_Audit.md
│       │   ├── H.1-Plan_Security_Audit.md
│       │   ├── H.2-Execute_Audit_Lot.md
│       │   ├── α-Start_Mission.md
│       │   └── Ω-Finalize_Mission.md
│       │
│       ├── templates/              # Modèles standardisés pour la génération d'artefacts (ADR, PRD, tâches).
│       │   ├── adr.template.md
│       │   ├── anomaly_report.template.md
│       │   ├── graph.template.md
│       │   ├── prd-feature.template.md
│       │   ├── prd-global.template.md
│       │   ├── task-report.template.md
│       │   └── task.template.md
│       │
│       ├── folder-structure.md    # Source de vérité pour la structure des dossiers du projet. À utiliser pour la localisation de fichiers.
│       └── conventions-naming.md  # Source de vérité pour les conventions de nommage. À utiliser pour valider/générer des noms.
│
│
├── alpha-v1-context/               # LE DOSSIER DE MISSION POUR L'ALPHA V1
│   ├── 1_Context_Input_Alpha_v1.md
│   ├── 2_Plan_de_Release_Alpha_v1.md
│   ├── 3_PRD_Global_Alpha_v1.md
│   ├── 4_Epiques_Alpha_v1/
│   │   ├── Charte_Epique_1_IAM.md
│   │   └── ... (les autres chartes de l'Alpha v1)
│   └── 5_PRD_Features_Alpha_v1/
│       ├── PRD_Feature_Login.md
│       └── ...
│
├── alpha-v2-context/               # Le dossier de mission pour la v2 (créé plus tard)
│   └── ...
│
├── adr/                            # Architecture Decision Records
│
├── annex/                          # Annexes (roadmap, events…)
│   ├── db-schema/
│   │   └── epic-1-iam.schema.md
│   ├── epic-1-iam/
│   │   ├── _plan.md
│   │   └── events.md
│   ├── epic-2-iam/
│   ├── epic-3-iam/
│   └── epic-4-iam/
│
├── prd/                            # Product Requirement Docs
│
├── apps/                           # Monorepo apps
│   ├── frontend/                   # Next.js + Atomic Design
│   │   ├── src/                    # Tout le code frontend
│   │   │   ├── app/                # Routes Next.js (App Router)
│   │   │   ├── components/         # Atomic Design
│   │   │   │   ├── atoms/
│   │   │   │   ├── molecules/
│   │   │   │   ├── organisms/
│   │   │   │   ├── templates/
│   │   │   │   └── pages/
│   │   │   ├── hooks/
│   │   │   ├── contexts/
│   │   │   ├── lib/
│   │   │   └── assets/             # images, icônes, fonts
│   │   ├── public/                 # Fichiers statiques
│   │   ├── next.config.js
│   │   └── tsconfig.json
│   │
│   └── backend/                    # NestJS + Prisma
│       ├── src/                    # Tout le code backend
│       │   ├── api/                # Modules / routes (controllers)
│       │   ├── services/           # Logique métier
│       │   ├── lib/                # Utils backend (logger, middlewares)
│       │   ├── jobs/               # Cron jobs / workers
│       │   └── observability/      # Logs, monitoring, sécurité
│       ├── prisma/                 # schema + migrations + seeds
│       ├── nest-cli.json           # Config NestJS
│       ├── tsconfig.json
│       └── package.json
│
├── packages/                       # Packages partagés
│   ├── ui/                         # Design system partagé (shadcn/ui customisé)
│   └── config/                     # Config ESLint, Prettier, tsconfig, Tailwind
│
├── tasks/                          # Tâches IA planifiées/exécutées
│   ├── alpha-v1/
│   │   ├── feature-iam-be/         # Tâches backend livrées (001 → 009)
│   │   ├── TASK-IAM-BE-001-DB-Schema.md
│   │   ├── TASK-IAM-BE-002-Auth-Guard.md
│   │   ├── TASK-IAM-BE-003-Tenant-Enforcement.md
│   │   └── ...
│   └── feature-iam-fe/         # À remplir (actuellement vide)
│
├── tests/                          # Tests unit/integration/e2e
│
├── infra/                          # Infra & Docker
│   ├── docker/
│   │   ├── frontend.Dockerfile
│   │   ├── backend.Dockerfile
│   │   └── docker-compose.yml
│   └── k8s/ (optionnel futur)
│
├── reports/
│   ├── execution/
│   │   └── alpha-v1/
│   │       └── feature-iam/        # Rapports d’exécution des tâches IAM backend
│   ├── quality-gate/
│   │   └── alpha-v1/
│   │       └── feature-iam/        # Rapports quality gate par feature
│   ├── security/
│   │   └── alpha-v1/               # Rapports d’audit sécurité
│   └── tech-debt/                  # Analyses dette technique (vide pour l’instant)
│
├── .github/workflows/              # CI/CD GitHub Actions
├── .env.local
├── .npmrc
├── package-lock.json
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── README.md
├── run_quality_gate_mac.sh
├── run_quality_gate_win.ps1
└──  run_quality_gate.sh