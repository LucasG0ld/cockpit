### ADR-0008 - Choix du Fournisseur d'Email Transactionnel

-   **Date:** 2025-10-24
-   **Status:** Accepted
-   **Owner:** Superviseur / Agent IA

---

#### 1. Context (Le Problème)
ClientFlow nécessite un service pour envoyer des emails critiques (transactionnels) pour des fonctionnalités clés comme les invitations d'équipe (Épique 1), les notifications de support (Épique 4) et, à terme, les relances de facturation (Phase Alpha v3). La tâche initiale `TASK-IAM-BE-005` a été conçue pour utiliser un service simulé ("stub") afin de ne pas bloquer le développement de la logique métier. Cependant, une décision sur le fournisseur réel est nécessaire pour planifier l'intégration et assurer la cohérence de l'architecture technique, en anticipant les futurs besoins en automatisation et en marketing identifiés dans la roadmap stratégique.

#### 2. Alternatives (Les Options Considérées)
-   **Option A : Resend**
    -   Fournisseur moderne avec une excellente expérience développeur (DX), particulièrement adapté à une stack React/Next.js. Focalisé sur les emails transactionnels.
-   **Option B : SendGrid**
    -   Plateforme tout-en-un mature qui gère à la fois les emails transactionnels et les campagnes marketing. Plus complexe mais très complète.
-   **Option C : Postmark**
    -   Spécialiste de l'email transactionnel, réputé pour son excellente délivrabilité. Refuse explicitement les emails marketing pour protéger la réputation d'envoi.
-   **Option D : Amazon SES**
    -   Service AWS très puissant et économique à grande échelle, mais plus "brut" et nécessitant une configuration et une maintenance plus importantes.

#### 3. Decision (La Solution Choisie)
Nous choisissons **Resend** comme fournisseur principal pour les emails transactionnels pour les phases Alpha et Bêta du projet.

Cette décision est motivée par son alignement parfait avec notre stack technique (Next.js, React), ce qui simplifiera et accélérera le développement. La stratégie consiste à séparer clairement les emails transactionnels (critiques) des futurs emails marketing, pour lesquels une solution spécialisée pourra être ajoutée plus tard sans impacter la délivrabilité des premiers.

#### 4. Consequences (Les Impacts)
-   **Pros / Bénéfices :**
    -   **Intégration Simplifiée :** L'API moderne et les composants React de Resend réduisent la complexité et le temps de développement.
    -   **Découplage Stratégique :** Assure une haute délivrabilité pour les emails critiques en les isolant des futures campagnes marketing.
    -   **Plan de Développement Clair :** La logique métier (`TASK-IAM-BE-005`) est développée sans délai, et l'intégration de Resend est gérée dans une tâche dédiée et atomique (`TASK-IAM-BE-005-A`).
-   **Cons / Risques :**
    -   **Solution Double à Terme :** Nécessitera l'intégration et la maintenance d'un second service pour les besoins marketing futurs (Phase v1.0).
-   **Supersedes :** N/A

#### 5. Compliance / Verification (La Preuve)
-   La tâche `TASK-IAM-BE-005` doit être complétée en utilisant un service d'email simulé (stub/mock), comme vérifiable dans les tests end-to-end qui ne doivent pas faire d'appel réseau externe pour l'envoi d'email.
-   Une nouvelle tâche, `TASK-IAM-BE-005-A`, doit être créée pour intégrer spécifiquement l'API de Resend et remplacer le service simulé.
-   Le plan de l'épique (`Plan-Epic-1-IAM.md`) doit être mis à jour pour refléter que les tâches dépendant de l'envoi d'email (ex: `TASK-IAM-BE-006`) dépendent désormais de `TASK-IAM-BE-005-A`.
-   **Artefacts Liés :**
    -   **Commit :** `[SHA du commit après implémentation de la tâche 005-A]`
    -   **Test Log :** `[Lien vers les logs des tests e2e de la tâche 005-A validant l'appel à l'API Resend]`