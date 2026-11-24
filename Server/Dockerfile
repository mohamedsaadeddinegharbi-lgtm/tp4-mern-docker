# Utiliser l'image de base node:lts-alpine
FROM node:lts-alpine

# Definir le repertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers package*.json
COPY package*.json ./

# Installer les dependances
RUN npm install

# Copier le reste des fichiers du serveur
COPY . .

# Exposer le port 9000
EXPOSE 9000

# Demarrer l'application
CMD ["npm", "start"]
