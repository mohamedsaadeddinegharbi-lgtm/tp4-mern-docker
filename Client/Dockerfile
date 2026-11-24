# Image de base
FROM node:lts-alpine

# Repertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package*.json
COPY package*.json ./

# Installer les dependances
RUN npm install

# Copier le reste des fichiers du client
COPY . .

# Construire l'application React
RUN npm run build

# Installer un serveur HTTP leger
RUN npm install -g serve

# Exposer le port 3000
EXPOSE 3000

# Servir les fichiers de build
CMD ["serve", "-s", "dist", "-l", "3000"]
