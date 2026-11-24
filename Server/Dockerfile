# Image de base
FROM node:lts-alpine

# Repertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package*.json
COPY package*.json ./

# Installer les dependances
RUN npm install

# Copier le reste des fichiers du serveur
COPY . .

# Variable d'environnement (la vraie valeur est definie dans docker-compose.yml)
ENV MONGO_URI=mongodb://mongodb:27017/mern

# Exposer le port 9000
EXPOSE 9000

# Demarrer l'application
CMD ["npm", "start"]
