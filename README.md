# BuildFlow — Gestion de Chantiers BTP

## Description
Application de gestion de chantiers utilisant une architecture SPA (Single Page Application) avec un backend Node/Express et un frontend en JS Vanilla (logique Vue-like).

## Fonctionnalités terminées
- [x] Dashboard avec statistiques globales.
- [x] Liste des chantiers (Projets).
- [x] Tableau Kanban avec 4 colonnes (À faire, En cours, Bloqué, Terminé).
- [x] Filtrage par statut, priorité et recherche textuelle.
- [x] Formulaire d'ajout de tâche avec validation et envoi au backend.

## Installation et Lancement
1. **Backend** : 
   - `cd backend`
   - `npm install`
   - `node server.js`
2. **Frontend** :
   - Ouvrir `frontend/buildflow_kanban_btp.html` dans un navigateur.

## Limites connues
- Les données sont stockées en mémoire vive (RAM) sur le serveur Express. Elles sont réinitialisées au redémarrage du serveur.