const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Définissez le schéma pour le modèle d'appartement
const schemaAppartement = mongoose.Schema({
    name: String,
    postedBy: String,
    price: Number,
    phone: Number,
    email: String,
    description: String,
    image: String
});

// Créez le modèle d'appartement en utilisant le schéma défini
const Appartement = mongoose.model('Appartement', schemaAppartement); // Utilisez 'Appartement' comme nom de modèle

let url = process.env.URL;

exports.testConnect = () => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url).then((err, stats) => {
            if (err) {
                reject(err);
            } else {
                resolve('Connected to MongoDB');
            }
        });
    });
};

module.exports = Appartement;
