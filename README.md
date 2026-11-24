# TP4 - Docker et Docker Compose

Mohamed Saad Edine Gharbi - 3 LIG

Dans ce TP j'ai conteneurise l'application MERN du projet MyAppReact (client React + serveur Express) avec Docker, puis je l'ai lancee avec Docker Compose. J'ai aussi ajoute un pipeline Jenkins pour automatiser le build et le deploiement.

Lien du projet GitHub : https://github.com/mohamedsaadeddinegharbi-lgtm/tp4-mern-docker

Images Docker Hub :
- https://hub.docker.com/r/hamagh04/mern-server
- https://hub.docker.com/r/hamagh04/mern-client

## 1. Cloner le projet

    git clone https://github.com/wiem-kb/MyAppReact.git

Le projet contient 2 dossiers : client (React) et server (Express).

## 2. Les Dockerfiles

Pour le serveur, j'ai cree un Dockerfile dans le dossier server. Il part de node:lts-alpine, copie les package*.json, fait npm install, copie le reste du code, expose le port 9000 et lance l'application avec npm start. La variable MONGO_URI est donnee dans le docker-compose.

    docker build -t mern-server ./server

Pour le client, meme principe dans le dossier client, mais apres npm install on fait npm run build pour generer les fichiers React, puis on installe serve pour les servir sur le port 3000.

    docker build -t mern-client ./client

Remarque : dans l'enonce la commande du client est ecrite avec mern-server, j'ai utilise mern-client sinon l'image du serveur est ecrasee.

## 3. Reseau Docker

    docker network create mern-network

## 4. MongoDB

    docker run -d --name mongodb --network mern-network mongo

## 5. Lancer le serveur et le client

    docker run -d --name server --network mern-network -p 9000:9000 mern-server
    docker run -d --name client --network mern-network -p 3000:3000 mern-client

Pour verifier :
- http://localhost:9000/api/health affiche {"message":"API is running"}
- http://localhost:3000 affiche la page React avec "API is running"

## 6. Docker Compose

J'ai ecrit le fichier docker-compose.yml a la racine avec 3 services :
- mongodb : image mongo
- server : build ./server, port 9000, depend de mongodb, variable MONGO_URI=mongodb://mongodb:27017/mern
- client : build ./client, port 3000, depend de server

Les 3 services sont dans le reseau mern-network (driver bridge). Le serveur peut joindre la base avec le nom mongodb.

    docker compose up --build

## 7. Pipeline Jenkins

Le Jenkinsfile contient les etapes suivantes : Checkout (recuperation du code depuis GitHub), Docker (verification de docker et docker compose), Build images, Deploy avec docker compose, Smoke Test (on teste l'API et le client avec curl) et Push des images sur Docker Hub avec le credential dockerhub-creds.

Les captures du pipeline, des images et des conteneurs sont jointes avec le compte rendu.
