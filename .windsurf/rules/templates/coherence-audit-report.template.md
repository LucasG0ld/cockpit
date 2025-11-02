---
trigger: manual
---

---
audit_id: "[concept_clé]_[YYYY-MM-DD]"
source_of_change: "[Chemin/vers/fichier_source_du_changement]"
status: "pending_validation"
date: "[YYYY-MM-DD]"
---

**Localisation :** Ce rapport doit être sauvegardé dans `reports/coherence/`

# Rapport d'Audit de Cohérence : [Concept Clé du Changement]

## 1. Résumé de l'Audit

[Générer 2-3 phrases synthétisant les résultats de l'audit. Inclure le nombre de fichiers analysés et le nombre de fichiers nécessitant une modification. Ex: "Suite à la mise à jour de l'ADR-003, un audit a été mené sur 7 fichiers de référence. 3 d'entre eux présentent des incohérences et nécessitent une synchronisation."]

## 2. Contexte de l'Audit (Source de la Nouvelle Vérité)

### Fichier Source du Changement
- `@[Chemin/vers/le/fichier_source]`

### Description du Changement ("Delta")
```diff
[Coller ici le 'git diff' ou le résumé du changement qui a déclenché l'audit]
```

## 3. Périmètre de l'Analyse

Les fichiers suivants ont été identifiés comme potentiellement impactés et ont été analysés :

- `[chemin/vers/fichier_candidat_1.md]`
- `[chemin/vers/fichier_candidat_2.md]`
- `[chemin/vers/fichier_candidat_3.md]`

## 4. Propositions de Synchronisation

Cette section détaille toutes les modifications nécessaires pour rendre la documentation cohérente avec la nouvelle source de vérité.

---
### Fichier : `[chemin/vers/fichier_impacté_1.md]`

**Justification :** [Expliquer brièvement pourquoi ce fichier est impacté. Ex: "Cette section du PRD Feature décrit l'ancien processus d'authentification."]

**Modification 1 :**
```diff
- AVANT
[Contenu de la section obsolète]
---
+ APRÈS
[Contenu de la nouvelle section corrigée]
```

*(Ajouter autant de blocs de modification que nécessaire pour ce fichier)*

---
### Fichier : `[chemin/vers/fichier_impacté_2.md]`

**Justification :** [Expliquer brièvement la raison de la modification.]

**Modification 1 :**
```diff
- AVANT
...
---
+ APRÈS
...
```

---

## 5. Fichiers Analysés sans Incohérence Détectée

Les fichiers suivants ont été analysés et jugés cohérents avec la nouvelle décision. Aucune action n'est requise.

- `[chemin/vers/fichier_analysé_et_ok_1.md]`
- `[chemin/vers/fichier_analysé_et_ok_2.md]`

## 6. Validation Humaine

**Instructions pour la validation :**

Veuillez relire attentivement les propositions de modification ci-dessus. Si elles sont correctes et complètes, validez ce rapport pour autoriser l'agent à procéder à l'implémentation.

- [ ] Je valide les propositions de synchronisation décrites dans ce rapport et j'autorise l'implémentation.

**Feedback / Notes pour ajustement (si nécessaire) :**
- [Laisser vide si tout est validé, sinon, fournir un feedback précis ici]
