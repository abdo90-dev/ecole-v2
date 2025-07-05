# 🎓 Student Management Platform – Hackathon ESTIAM 2025

Une plateforme web moderne, sécurisée et responsive permettant la **gestion centralisée des étudiants** dans un établissement d'enseignement supérieur.

## 🚀 Objectifs du projet

- Centraliser la gestion des profils étudiants, inscriptions, et filières
- Offrir un tableau de bord statistique interactif en temps réel
- Proposer une interface moderne, ergonomique et responsive
- Mettre en place une authentification sécurisée avec rôles (admin / étudiant)
- Faciliter les opérations de recherche, ajout, modification et suppression (CRUD)

## 🛠️ Stack technique

| Composant       | Rôle                                              |
|----------------|---------------------------------------------------|
| React + Vite   | Interface utilisateur (SPA)                       |
| TypeScript     | Robustesse du code                                |
| Tailwind CSS   | Design responsive rapide                          |
| Supabase       | Backend, authentification, base de données        |
| ESLint         | Qualité du code                                   |
| npm / PostCSS  | Gestion des dépendances et des styles             |

## 📐 Architecture du système

- **Frontend** : React + Tailwind CSS
- **State Management** : Context API
- **Backend** : Supabase (auth, DB) ou JSON local (pour prototypage)
- **Sécurité** : Authentification JWT, gestion des rôles

## 🔒 Fonctionnalités principales

- ✅ Authentification sécurisée avec rôles
- 🧑‍🎓 CRUD complet des étudiants
- 🏫 Gestion des filières
- 📊 Dashboard statistique (graphiques dynamiques)
- 🔎 Recherche en temps réel
- ⬇️ Export/Import des données
- 📱 Design responsive compatible desktop / tablette / mobile

## 🧪 Tests et Validation

- ✅ Tests fonctionnels (CRUD, login, etc.)
- 📱 Tests d’ergonomie (retours utilisateurs)
- 🔐 Tests de sécurité (droits d’accès, sessions)
- ⚡ Tests de performance (rapidité, charge)

## ⚙️ Instructions d'installation

```bash
# Clone le repo
git clone https://github.com/ton-utilisateur/student-management-app.git
cd student-management-app

# Installe les dépendances
npm install

# Lancer le serveur de développement
npm run dev
