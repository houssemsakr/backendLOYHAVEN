const express = require('express');
const route = express.Router();
const multer = require('multer');
const Demandes = require('../models/demandes.model');

let filename = '';
const mystorage = multer.diskStorage({
    destination: './upload',
    filename: (req, file, cb) => {
        let date = Date.now();
        let fl = date + '.' + file.mimetype.split('/')[1];
        cb(null, fl);
        filename = fl;
    }
});

const upload = multer({ storage: mystorage });

// Créer un nouvel Demandes avec upload d'image
route.post('/create', upload.any('image'), (req, res) => {
    let dataFromPostman = req.body;
    let newDemandes = new Demandes(dataFromPostman); // Utilisation de newDemandes pour créer une nouvelle instance
    newDemandes.image = filename;
    newDemandes.save()
        .then((savedDemandes) => {
            filename = '';
            console.log('Demandes créé avec succès :', savedDemandes);
            res.send(savedDemandes);
        })
        .catch((error) => {
            console.error('Erreur lors de la création de Demandes :', error);
            res.status(500).send(error);
        });
});

// Récupérer tous les Demandes
route.get('/all', (req, res) => {
    Demandes.find()
        .then((allDemandes) => {
            res.send(allDemandes);
        })
        .catch((error) => {
            console.error('Erreur lors de la récupération de tous les Demandes :', error);
            res.status(500).send(error);
        });
});

// Récupérer un Demandes par ID
route.get('/getbyid/:id', (req, res) => {
    let myid = req.params.id;

    // Vérifier si myid est un ID valide
    if (!myid.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).send('ID invalide');
    }

    // Recherche de Demandes par ID avec findById
    Demandes.findById(myid)
        .then((demandes) => {
            if (!demandes) {
                return res.status(404).send('Demandes non trouvée');
            }
            res.send(demandes);
        })
        .catch((err) => {
            console.error('Erreur lors de la recherche de Demandes par ID :', err);
            res.status(500).send('Erreur serveur');
        });
});

// Supprimer un Demandes par ID
route.delete('/supprimer/:id', (req, res) => {
    let id = req.params.id;
    Demandes.findByIdAndDelete(id)
        .then((deletedDemandes) => {
            if (!deletedDemandes) {
                return res.status(404).send('Demandes non trouvée');
            }
            res.send(deletedDemandes);
        })
        .catch((err) => {
            console.error('Erreur lors de la suppression de Demandes par ID :', err);
            res.status(500).send(err);
        });
});

// Obtenir le nombre total de Demandes
route.get('/count', async (req, res) => {
    try {
        const count = await Demandes.countDocuments();
        res.json({ count });
    } catch (err) {
        console.error('Erreur lors du comptage des Demandes :', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = route;
