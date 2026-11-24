import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();  // Charge les variables d'environnement à partir d'un fichier .env

const app = express();

// Middleware pour autoriser les requêtes cross-origin
app.use(cors());

// Middleware pour parser les requêtes JSON
app.use(express.json());

// Connexion à MongoDB avec la variable d'environnement MONGO_URI
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mern';
mongoose.connect(MONGO_URI)
  .then(() => console.log(`Connecté à MongoDB : ${MONGO_URI}`))
  .catch((err) => console.error('Erreur de connexion MongoDB :', err.message));

// Exemple de route API
app.get('/api/health', (req, res) => {
  res.json({
    message: 'API is running',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Démarrer le serveur sur le port 9000
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
