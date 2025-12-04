# 🏨 Application de Gestion d'Hôtels - Full Stack

Application web full-stack de gestion d'hôtels avec interface d'administration complète, développée avec Laravel 11 (backend) et Next.js 16 (frontend).

## 📋 Prérequis

- **Docker** (version 20.10 ou supérieure)
- **Docker Compose** (version 2.0 ou supérieure)

Aucune autre installation n'est requise. Tout le projet s'exécute dans des conteneurs Docker.

## 🚀 Démarrage Rapide

### 1. Cloner le projet

```bash
git clone https://github.com/tatlapa/defi-fullstack
cd defi-fullstack
```

### 2. Lancer l'application

```bash
docker compose up --build
```

Cette commande va :
- Construire les images Docker pour le backend, frontend et nginx
- Démarrer les services (Laravel, Next.js, MySQL, Nginx)
- Exposer les ports nécessaires

## 🌐 URLs d'accès

Une fois tous les services démarrés :

- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:8000
- **Reverse Proxy** : http://localhost
- **Base de données MySQL** : localhost:3306

### Pages disponibles

- **Page publique** : http://localhost:3000/hotels - Liste des hôtels avec pagination
- **Page de détails** : http://localhost:3000/hotels/:id - Détails d'un hôtel avec carrousel d'images
- **Interface d'administration** : http://localhost:3000/hotels/edit - CRUD complet avec drag & drop

## 🏗️ Architecture

### Stack Technique

#### Backend
- **Framework** : Laravel 11
- **Base de données** : MySQL 8.0
- **Storage** : Système de fichiers local (storage/app/public)
- **API** : RESTful avec validation des données

#### Frontend
- **Framework** : Next.js 16 (App Router)
- **UI Library** : Chakra UI v3
- **State Management** : Zustand
- **Drag & Drop** : @dnd-kit

#### Infrastructure
- **Conteneurisation** : Docker + Docker Compose
- **Reverse Proxy** : Nginx
- **Volumes** : Persistence MySQL

### Structure du Projet

```
defi-fullstack/
├── backend/                    # API Laravel
│   ├── app/
│   │   ├── Http/Controllers/  # Contrôleurs (HotelController)
│   │   └── Models/            # Modèles (Hotel, HotelsPicture)
│   ├── database/
│   │   ├── migrations/        # Migrations de la BDD
│   │   └── seeders/           # Données de test
│   └── storage/               # Fichiers uploadés
│
├── frontend/                   # Application Next.js
│   ├── src/
│   │   ├── app/               # Pages (App Router)
│   │   ├── components/        # Composants React
│   │   ├── stores/            # Zustand stores
│   │   └── types/             # Types TypeScript
│   └── public/                # Assets statiques
│
├── nginx/                      # Configuration Nginx
└── docker-compose.yml          # Orchestration Docker
```

### Reverse Proxy (Nginx)

Le reverse proxy Nginx sert de point d'entrée unique pour l'application sur le port 80.

#### Routage des requêtes

```
Client (navigateur)
       ↓
   Port 80 (Nginx)
       ↓
       ├─→ / (racine) ────────→ Frontend (Next.js:3000)
       │   • Toutes les pages HTML
       │   • Assets statiques (JS, CSS, images)
       │   • Support WebSocket (hot reload)
       │
       └─→ /api/ ─────────────→ Backend (Laravel:8000)
           • Endpoints RESTful
           • Upload/download de fichiers
           • Headers X-Forwarded-* pour l'IP réelle
```

#### Configuration (nginx/conf.d/default.conf)

**Location `/` - Frontend**
- Proxyfie toutes les requêtes vers `http://frontend:3000`

**Location `/api/` - Backend**
- Proxyfie vers `http://backend:8000`
- Headers `X-Real-IP` et `X-Forwarded-For` pour tracer l'IP client réelle
- Header `X-Forwarded-Proto` pour préserver le protocole HTTP/HTTPS

#### Avantages

- **Point d'entrée unique** : Un seul port (80) au lieu de gérer 3000 et 8000
- **Isolation des services** : Frontend et backend ne sont pas exposés directement
- **Production-ready** : Architecture standard monorepo Docker pour le déploiement en production

🛠️ Améliorations futures & effort fourni

J’ai consacré environ 12 heures par jour pendant 3 jours à la réalisation de ce projet, soit un total d’environ 36 heures de travail intensif pour concevoir, développer, dockeriser et documenter l’application.

Si je devais aller plus loin, voici les améliorations que j’apporterais :

🔐 Système d’authentification & rôles

Ajout d’un système complet d’authentification (JWT ou Laravel Sanctum)

Gestion de rôles (admin, user, etc.)

Restriction d’accès à l’interface d’administration

🎨 Amélioration de l’UI/UX

Refonte visuelle plus moderne et homogène

Meilleure hiérarchie visuelle et typographie

Feedback utilisateurs améliorés (toasts, loaders, transitions)

Accessibilité renforcée (focus states, contrastes, ARIA)
