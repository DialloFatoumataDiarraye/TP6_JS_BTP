# BuildFlow — Gestion de Chantiers BTP

## Description
Application de gestion de chantiers utilisant une architecture propre avec un backend Node/Express et un frontend en Vue.js 3 (Vite).

## Fonctionnalités terminées
- [x] Structure Frontend (Vue 3, Vite, Vue Router).
- [x] Structure Backend (Express, API RESTful).
- [x] Liste des chantiers (Projets).
- [x] Tableau Kanban avec 4 colonnes (À faire, En cours, Bloqué, Terminé).
- [x] Filtrage par statut, priorité et recherche textuelle.
- [x] Formulaire d'ajout de tâche avec validation et envoi au backend.
- [x] Détails des projets et des tâches (Vue Router).
- [x] Interface propre inspirée des couleurs du BTP (Bleu, Orange, Gris).

## Architecture
- `frontend/` : Application Vue.js 3 générée avec Vite.
- `backend/` : Serveur Node.js avec Express servant l'API REST.

## Installation et Lancement
### 1. Backend
- `cd backend`
- `npm install`
- `npm start` (Le serveur démarre sur le port 3000)

### 2. Frontend
- `cd frontend`
- `npm install`
- `npm run dev` (Le serveur de développement Vite démarre, généralement sur le port 5173)

## Limites connues
- Les données sont stockées en mémoire vive (RAM) sur le serveur Express. Elles sont réinitialisées au redémarrage du serveur.
- Pas d'authentification pour les rôles (Chef de projet vs Conducteur de travaux).

## Prochaines étapes
- Connecter une base de données réelle (MongoDB ou PostgreSQL).
- Ajouter un système d'authentification et de rôles.
- Implémenter le drag & drop pour déplacer les tâches entre les colonnes du Kanban.