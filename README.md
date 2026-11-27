# Gestion des guides touristiques

Application front-end Angular permettant à un agent de la structure chargée de promouvoir le tourisme au Sénégal de **consulter, rechercher, filtrer et administrer** un répertoire de guides touristiques.

Projet réalisé dans le cadre du cours *Développement front-end* (Licence 2 Ingénierie Informatique, chapitre 4 : Angular). **Toutes les données sont fictives.**

## Équipe

| Membre | Contribution |
|---|---|
| Algassimou Diallo | Architecture (interface, service, routage), page d'édition, intégration, README |
| Mamadou Lamine Coly | Composant liste : tableau, recherche, filtres, badges, suppression avec confirmation |
| Mariama Sadio Diallo | Composant formulaire : champs, validations, messages (logique du formulaire) |

## Prérequis

- [Node.js](https://nodejs.org) version LTS (développé avec Node.js 24)
- npm (installé avec Node.js)
- Angular CLI : `npm install -g @angular/cli` (développé avec la version 22)
- Git

Vérification :

```bash
node -v
npm -v
ng version
```

## Installation

```bash
git clone https://github.com/dias2006zlfjsjc-lgtm/gestion-guides.git
cd gestion-guides
npm install
```

## Lancement

```bash
ng serve
```

Ouvrir ensuite http://localhost:4200 dans un navigateur. L'application redirige vers `/guides`.

Autres commandes utiles :

```bash
ng build     # compilation de production (dossier dist/)
ng test      # tests unitaires
```

## Fonctionnalités

- **Répertoire** : tableau lisible des guides (nom, prénom, spécialité, région, note, statut).
- **Recherche** par nom, prénom ou spécialité, avec message explicite si aucun résultat.
- **Filtres** par région et par statut, combinables avec la recherche, et bouton de réinitialisation.
- **Présentation** : note formatée avec un pipe, statut affiché par un badge coloré (Actif / Inactif).
- **Ajout** d'un guide via un formulaire (champs obligatoires).
- **Validations** : e-mail, téléphone sénégalais, longueurs minimales, note comprise entre 0 et 5.
- **Modification** d'une fiche (formulaire pré-rempli).
- **Suppression** avec confirmation préalable.
- **Messages** de succès et d'erreur compréhensibles.
- **Jeu de données de démonstration** (5 guides fictifs) et état vide.
- **Interface responsive**, navigation au clavier, champs associés à des labels.

## Routes

| Adresse | Page |
|---|---|
| `/guides` | Liste, recherche et filtres |
| `/guides/nouveau` | Formulaire d'ajout |
| `/guides/:id/modifier` | Formulaire de modification |

## Structure du projet et rôle des fichiers

| Fichier / dossier | Rôle |
|---|---|
| `package.json` | Dépendances (Angular, Angular Material...) et scripts ; lu par `npm install` |
| `package-lock.json` | Versions exactes installées, identiques pour toute l'équipe |
| `angular.json` | Configuration du projet pour le CLI (sources, styles globaux, compilation) |
| `tsconfig*.json` | Configuration de TypeScript (application et tests) |
| `src/index.html` | Unique page HTML, contient la balise racine `<app-root>` |
| `src/main.ts` | Point d'entrée : démarre l'application |
| `src/styles.css`, `src/material-theme.scss` | Styles globaux et thème Angular Material commun |
| `src/app/app.config.ts` | Configuration globale (fournisseurs : routeur...) |
| `src/app/app.ts`, `app.html`, `app.css` | Composant racine : menu de navigation et zone `router-outlet` |
| `src/app/app.routes.ts` | Table de routage : associe chaque adresse à un composant |
| `src/app/models/guide-touristique.ts` | Interface TypeScript `GuideTouristique` |
| `src/app/services/guide.ts` | Service injectable `GuideService` : centralise les données et le CRUD |
| `src/app/components/guide-list/` | Composant liste : affichage, recherche, filtres, suppression |
| `src/app/components/guide-form/` | Composant formulaire réutilisable : ajout et modification |
| `src/app/components/guide-edition/` | Page qui relie la route, le service et le formulaire |
| `.gitignore` | Fichiers exclus de Git (`node_modules`...) |

Trajet de démarrage : `index.html` contient `<app-root>`, `main.ts` démarre l'application avec `app.config.ts`, le composant `App` affiche le menu et le `router-outlet`, et `app.routes.ts` choisit le composant à afficher.

## Architecture

- **Séparation des responsabilités** : la liste affiche, le formulaire saisit, le service gère les données.
- Le composant `GuideForm` ne connaît pas le service : il reçoit un guide (entrée `guide`) et émet les données saisies (sorties `enregistrer` et `annuler`). La page `GuideEdition` fait le lien avec le service.
- Données centralisées dans `GuideService` (injectable, `providedIn: 'root'`).

## Bibliothèques utilisées

| Bibliothèque | Rôle |
|---|---|
| Angular (CLI 22) | Framework de l'application |
| Angular Material et CDK | Composants d'interface (tableau, champs, listes, cartes, boutons, boîtes de dialogue) et thème |
| Police Roboto et icônes Material | Typographie et icônes (chargées via `index.html`) |

Aucune autre bibliothèque externe n'est utilisée.

## Limites de la solution

1. **Pas de persistance** : les guides sont stockés en mémoire dans le service. Tout ajout, modification ou suppression est perdu au rechargement de la page. *Piste : enregistrer les données dans une base de données via une API.*
2. **Validation uniquement côté client** : les contrôles du formulaire (e-mail, téléphone, note) peuvent être contournés. Dans une application réelle, le serveur doit revalider chaque donnée. *Piste : doubler les contrôles côté serveur.*
3. **Pas d'authentification** : n'importe quel utilisateur peut ajouter ou supprimer une fiche. *Piste : connexion des agents avec des rôles.*
4. **Pas de pagination** : l'affichage devient lourd avec un grand nombre de guides. *Piste : pagination côté serveur.*

## Évolution possible vers une API REST

Le tableau du `GuideService` serait remplacé par des appels `HttpClient` vers une API :

| Opération | Requête |
|---|---|
| Lister | `GET /guides` |
| Lire un guide | `GET /guides/:id` |
| Ajouter | `POST /guides` |
| Modifier | `PUT /guides/:id` |
| Supprimer | `DELETE /guides/:id` |

Les méthodes du service renverraient des `Observable` au lieu de valeurs directes. Les composants changeraient peu, car l'accès aux données est centralisé dans le service : c'est l'intérêt de la séparation des responsabilités.

## Captures d'écran

Les captures se trouvent dans le dossier `captures/` (à ajouter) :

- `captures/liste.png` : répertoire avec recherche et filtres
- `captures/formulaire.png` : formulaire d'ajout avec validations
- `captures/modification.png` : formulaire de modification pré-rempli

## Travail en équipe (Git)

- Une branche par fonctionnalité, jamais de commit direct sur `main`.
- Intégration par Pull Request, relue par le coordinateur avant fusion.
