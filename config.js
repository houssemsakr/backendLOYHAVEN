// Charger les variables d'environnement à partir du fichier .env
require('dotenv').config();

// Récupérer les variables d'environnement
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const SECRET_KEY = process.env.SECRET_KEY;
const CLIENT_KEY = process.env.CLIENT_KEY;
const URL = process.env.URL;

// Exporter les variables pour les utiliser dans votre application
module.exports = {
  PRIVATE_KEY,
  SECRET_KEY,
  CLIENT_KEY,
  URL
};
