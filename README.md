# 😂 Meme Generator

Un générateur de mèmes en ligne simple, rapide et moderne.  
Télécharge une image, ajoute du texte, vois le résultat en temps réel, télécharge ton mème et partage-le directement sur les réseaux sociaux.

## ✨ Fonctionnalités

- **Upload d'image** : depuis ton ordinateur (redimensionnement automatique)
- **Texte personnalisé** : texte haut + texte bas (style meme classique Impact)
- **Aperçu en temps réel** : modifications instantanées sur le canvas
- **Options de texte** : taille et couleur personnalisables
- **Téléchargement** : en JPG haute qualité
- **Sauvegarde** : galerie personnelle persistante (via Firebase Firestore + ImgBB)
- **Partage** : boutons directs pour X (Twitter), Facebook et WhatsApp
- **Support Docker** : prêt à lancer avec `docker compose up`

## 🛠 Technologies utilisées

- **Frontend** : React + Vite + Tailwind CSS
- **Canvas** : HTML5 Canvas (texte en temps réel)
- **Stockage images** : ImgBB (API gratuite)
- **Base de données** : Firebase Firestore (authentification anonyme)
- **Containerisation** : Docker + Docker Compose

## 📁 Structure du projet

meme-generator/

├── src/

│   └── App.jsx                 # Composant principal

├── public/

├── Dockerfile

├── docker-compose.yml

├── package.json

├── tailwind.config.js

├── .gitignore

└── README.md


## 🚀 Installation & Lancement

### 1. Version classique (recommandée pour le développement)
Run the commands:
npm install
npm run dev

Ouvre ton navigateur à l'adresse localhost indiquée

### 2. En utilisant Docker (le plus simple)

docker compose up --build

L'application sera disponible sur l'adresse localhost indiquée


## 📸 Comment utiliser

-Clique sur "Créer un mème"

-Télécharge une image depuis ton ordinateur

-Ajoute ton texte en haut et en bas

-Ajuste la taille et la couleur du texte

-Clique sur "💾 Sauvegarder" → ton mème est enregistré dans ta galerie

-Télécharge-le ou partage-le directement sur les réseaux


Auteur : Peace Kassa
