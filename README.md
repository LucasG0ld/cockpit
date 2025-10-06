# Cockpit 🚀

**Cockpit** est un SaaS moderne destiné à gérer les données sensibles et les projets de plusieurs organisations. Il est conçu pour être rapide, sécurisé, évolutif et facile à maintenir.

---

## 🏗️ Stack technique

### Frontend
- **Next.js 15 + React 19** : rendu côté serveur (SSR) et statique (SSG) pour une app rapide et SEO-friendly.
- **TailwindCSS + shadcn/ui** : design moderne et composants réutilisables.
- **React Query (TanStack Query)** : gestion du cache et des requêtes côté client.
- **Recharts** : graphiques interactifs pour les KPIs.
- **Clerk** : gestion des utilisateurs et authentification.
- **Stripe** : paiement et gestion des abonnements.

### Backend
- **NestJS + TypeScript** : architecture modulaire, tests, sécurité et règles métier.
- **Prisma + PostgreSQL (Neon)** : base de données relationnelle robuste et multi-tenant.
- **API REST** : communication entre frontend et backend.

### Dev & Workflow
- **pnpm** : gestionnaire de paquets rapide et efficace.
- **Git + GitHub Actions** : CI/CD, tests automatiques et déploiement.
- **Docker** : uniformisation des environnements dev et prod.
- **Jest** : tests unitaires.
- **Storybook** (optionnel) : documentation visuelle des composants.

---

## 📂 Structure du projet

```
cockpit/
  apps/
    frontend/   # Next.js + UI + React Query + Clerk
    backend/    # NestJS + Prisma + Stripe
  packages/
    ui/         # composants partagés
    config/     # ESLint, Prettier, tsconfig partagés
  .github/workflows/   # CI/CD GitHub Actions
  .gitignore
  package.json
  pnpm-workspace.yaml
```

---

## ⚡ Installation

1. Cloner le repo :
```bash
git clone https://github.com/LucasG0ld/cockpit.git
cd cockpit
```

2. Installer les dépendances :
```bash
pnpm install
```

3. Configurer la base de données `.env` dans `apps/backend/` :
```
DATABASE_URL="postgresql://user:password@host:5432/cockpit"
```

4. Lancer le frontend et backend en développement :
```bash
# Frontend
cd apps/frontend
pnpm dev

# Backend
cd ../backend
pnpm run start:dev
```

---

## 🧪 Tests

```bash
# Exécuter les tests unitaires du backend
cd apps/backend
pnpm test
```

---

## 🔐 Sécurité & bonnes pratiques
- HTTPS obligatoire.
- Données sensibles chiffrées.
- Audit log pour tracer les actions critiques.
- Rate limiting sur l’API.

---

## 📈 CI/CD

Le projet utilise **GitHub Actions** pour :
- Linting automatique.
- Tests unitaires.
- Déploiement continu sur les environnements de staging et production.

---

## 💡 Contribution

- Respectez la convention de commits (`feat:`, `fix:`, `chore:`…).
- Créez des branches pour chaque fonctionnalité ou bugfix.
- Les PR doivent passer la CI avant merge.

---

## 📄 Licence
MIT License

