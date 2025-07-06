# 🎓 Plateforme de Gestion des Étudiants – ESTIAM (ecole-v2)

Bienvenue sur `ecole-v2`, une application web moderne, sécurisée et responsive développée lors du **Hackathon ESTIAM (juillet 2025)**. Elle permet de centraliser la gestion des étudiants pour les établissements d’enseignement supérieur.

🔗 Dépôt GitHub : [abdo90-dev/ecole-v2](https://github.com/abdo90-dev/ecole-v2)

---

## 🚀 Fonctionnalités principales

- 🔐 Authentification Firebase (Admins & Étudiants)
- 🧑‍🎓 CRUD complet sur les étudiants
- 🏫 Gestion des filières
- 📊 Tableau de bord avec statistiques dynamiques (effectifs, répartition, évolution)
- 🔎 Recherche instantanée
- 📁 Import / Export de données

---

## 🛠️ Stack technique

| Technologie       | Utilisation                                |
|-------------------|---------------------------------------------|
| **React + Vite**  | Application web rapide et modulaire         |
| **TypeScript**    | Sécurité et typage strict                   |
| **Tailwind CSS**  | UI moderne, responsive et rapide à créer    |
| **Firebase**      | Authentification + base de données (Firestore) |
| **npm / PostCSS** | Gestion des dépendances et des styles       |
| **ESLint**        | Linting et qualité du code                  |

---

## ⚙️ Installation & Lancement

```bash
# Cloner le projet
git clone https://github.com/abdo90-dev/ecole-v2.git
cd ecole-v2

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

> 🔑 Crée un projet Firebase, active Firestore et l'authentification par e-mail/mot de passe.  
> 📁 Ajoute un fichier `.env` avec les clés Firebase (voir `.env.example` si présent).

---

## 🔧 Configuration Firebase (`.env`)

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## 🔐 Comptes de test

| Rôle        | Email                             | Mot de passe    |
|-------------|-----------------------------------|-----------------|
| **Admin**   | haddadiabdelhak64@gmail.com       | Callman1234     |
| **Étudiant**| khalid.mokhtar@example.com        | Callman1234     |

---

## 📁 Structure du projet

```
ecole-v2/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/          # Firebase config & API calls
│   └── utils/
├── public/
├── .env
└── README.md
```

---

## ✅ Tests et Validation

- 🔄 Tests manuels fonctionnels (CRUD, login)
- 🔐 Vérification des permissions selon les rôles (admin / étudiant)
- 📱 Tests responsive sur desktop / tablette / mobile

---

## 📈 Idées d’amélioration

- 📲 Version mobile avec React Native
- 🔔 Notifications automatiques (inscription, maj de profil)
- 📄 Export PDF / Excel des statistiques
- 💬 Module de messagerie interne
- 🗃️ Système de gestion documentaire (relevés de notes, attestations)
- 🎛️ Tableau de bord personnalisable selon le rôle

---

## 📜 Licence

Projet réalisé à des fins pédagogiques lors du Hackathon ESTIAM (Juillet 2025).  
Libre de réutilisation avec attribution.
