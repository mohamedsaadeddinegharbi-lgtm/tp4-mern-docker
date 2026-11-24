# TP4 – Docker et Docker Compose (application MERN)

Application MERN (MongoDB, Express, React, Node.js) conteneurisée avec Docker, orchestrée avec Docker Compose et automatisée avec un pipeline Jenkins.

## Structure du projet

| Élément | Rôle |
| --- | --- |
| `Client/` | Application React (Vite), servie sur le port 3000 |
| `Client/Dockerfile` | Image `mern-client` |
| `Server/` | API Express, port 9000, route `/api/health` |
| `Server/Dockerfile` | Image `mern-server` |
| `docker-compose.yml` | Services `mongodb`, `server`, `client` + réseau `mern-network` |
| `Jenkinsfile` | Pipeline : Checkout → Docker → Build images → Deploy → Smoke Test |

## Étapes réalisées

### 1. Cloner le projet
```bash
git clone https://github.com/wiem-kb/MyAppReact.git
```
Le projet contient deux dossiers : `Client` (React) et `Server` (Express).

### 2. Créer les Dockerfiles

**Serveur (`Server/Dockerfile`)** : image `node:lts-alpine`, répertoire de travail `/app`, copie de `package*.json`, `npm install`, copie du reste des fichiers, port 9000, démarrage avec `npm start`. La variable `MONGO_URI` est définie dans Docker Compose.

**Client (`Client/Dockerfile`)** : image `node:lts-alpine`, répertoire de travail `/app`, copie de `package*.json`, `npm install`, copie du reste des fichiers, `npm run build`, installation de `serve`, port 3000, démarrage avec `serve -s dist -l 3000`.

Le serveur Express a été complété pour se connecter à MongoDB avec la variable `MONGO_URI` (package `mongoose`). La route `/api/health` indique aussi l'état de la base.

Construction des images :
```bash
docker build -t mern-server ./server
docker build -t mern-client ./client
```

### 3. Créer un réseau Docker
```bash
docker network create mern-network
```

### 4. Exécuter MongoDB dans un conteneur
```bash
docker run -d --name mongodb --network mern-network mongo
```

### 5. Exécuter le serveur et le client
```bash
docker run -d --name server --network mern-network -p 9000:9000 mern-server
docker run -d --name client --network mern-network -p 3000:3000 mern-client
```
Résultat :
- http://localhost:9000/api/health → `{"message":"API is running","database":"connected"}`
- http://localhost:3000 → la page React affiche « API is running »

### 6. Docker Compose
Le fichier `docker-compose.yml` définit :
- `mongodb` : image `mongo`, conteneur `mongodb`, réseau `mern-network` ;
- `server` : build `./Server`, conteneur `server`, port 9000, dépend de `mongodb`, variable `MONGO_URI=mongodb://mongodb:27017/mern` ;
- `client` : build `./Client`, conteneur `client`, port 3000, dépend de `server` ;
- le réseau `mern-network` avec le driver `bridge`.

Dans le réseau Compose, le serveur joint MongoDB par le nom du service (`mongodb`).

Lancement :
```bash
docker compose up --build
```

### 7. Pipeline Jenkins
Le `Jenkinsfile` automatise le déploiement :
1. **Checkout** : récupère le code depuis GitHub ;
2. **Docker** : vérifie `docker version` et `docker compose version` ;
3. **Build images** : `docker compose build` ;
4. **Deploy** : `docker compose up -d` ;
5. **Smoke Test** : vérifie que l'API répond, que MongoDB est connecté et que le client renvoie `200 OK`.

## Commandes utiles
```bash
docker compose ps        # état des conteneurs
docker compose logs -f   # journaux
docker compose down      # arrêter et supprimer les conteneurs
```
