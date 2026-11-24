# TP4 : Docker et Docker Compose

Déploiement de l'application MERN (MongoDB, Express, React, Node.js) avec Docker et Docker Compose, puis automatisation avec un pipeline Jenkins.

## Liens

- Projet GitHub : https://github.com/mohamedsaadeddinegharbi-lgtm/tp4-mern-docker
- Image du serveur sur Docker Hub : https://hub.docker.com/r/hamagh04/mern-server
- Image du client sur Docker Hub : https://hub.docker.com/r/hamagh04/mern-client

## 1. Cloner le projet

```bash
git clone https://github.com/wiem-kb/MyAppReact.git
```

Le projet contient deux dossiers principaux : `client` (application React) et `server` (API Express).

## 2. Créer les Dockerfiles

### a. Serveur (Express) : `server/Dockerfile`

- Image de base `node:lts-alpine`
- Répertoire de travail `/app`
- Copie des fichiers `package*.json`
- Installation des dépendances avec `npm install`
- Copie du reste des fichiers du serveur
- Exposition du port 9000
- Démarrage avec `npm start`
- La variable `MONGO_URI` est définie dans Docker Compose

```bash
docker build -t mern-server ./server
```

### b. Client (React) : `client/Dockerfile`

- Image de base `node:lts-alpine`
- Répertoire de travail `/app`
- Copie des fichiers `package*.json`
- Installation des dépendances avec `npm install`
- Copie du reste des fichiers du client
- Construction de l'application avec `npm run build`
- Installation du serveur HTTP léger `serve`
- Exposition du port 3000
- Démarrage de `serve` pour servir les fichiers de build

```bash
docker build -t mern-client ./client
```

## 3. Créer un réseau Docker

```bash
docker network create mern-network
```

## 4. Exécuter MongoDB dans un conteneur

```bash
docker run -d --name mongodb --network mern-network mongo
```

## 5. Exécuter les conteneurs du serveur et du client

```bash
docker run -d --name server --network mern-network -p 9000:9000 mern-server
docker run -d --name client --network mern-network -p 3000:3000 mern-client
```

Vérification :
- http://localhost:9000/api/health renvoie `{"message":"API is running"}`
- http://localhost:3000 renvoie `HTTP/1.1 200 OK` et affiche « API is running »

## 6. Docker Compose

Le fichier `docker-compose.yml` à la racine du projet définit :
- `mongodb` : image `mongo`, conteneur `mongodb`, réseau `mern-network` ;
- `server` : construit depuis `./server`, conteneur `server`, port 9000, réseau `mern-network`, dépend de `mongodb`, variable `MONGO_URI=mongodb://mongodb:27017/mern` ;
- `client` : construit depuis `./client`, conteneur `client`, port 3000, réseau `mern-network`, dépend de `server` ;
- le réseau `mern-network` avec le driver `bridge`.

Dans le réseau Compose, le serveur accède à MongoDB par le nom du service (`mongodb`).

```bash
docker compose up --build
```

## 7. Pipeline Jenkins

Le `Jenkinsfile` automatise les étapes :
1. **Checkout** : récupération du code depuis GitHub ;
2. **Docker** : vérification de `docker version` et `docker compose version` ;
3. **Build images** : `docker build` de `mern-server` et `mern-client` ;
4. **Deploy (docker compose)** : `docker compose up -d --build` ;
5. **Smoke Test** : l'API répond « API is running » et le client répond `200 OK` ;
6. **Push (Docker Hub)** : envoi des images `hamagh04/mern-server` et `hamagh04/mern-client` avec l'identifiant Jenkins `dockerhub-creds`.

## Captures

- `capture-pipeline-jenkins.jpg` : pipeline Jenkins réussi
- `capture-images-docker.jpg` : images `mern-server` et `mern-client` dans Docker Desktop
- `capture-conteneurs-docker.jpg` : conteneurs `mongodb`, `server` et `client` en exécution
- `capture-logs-server-docker.jpg` : logs du conteneur `server` (« Server running on port 9000 »)
