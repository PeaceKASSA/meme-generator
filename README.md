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

## 🚀 Installation & Lancement

### 1. Version classique (recommandée pour le développement)

```bash
git clone https://github.com/ton-username/meme-generator.git
cd meme-generator

npm install
npm run dev
