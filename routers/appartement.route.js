const express = require('express');
const route = express.Router();
const multer = require('multer');
const Appartement = require('../models/appartement.model');
const appartements = require('../models/Appartement');

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

// Créer un nouvel appartement avec upload d'image
route.post('/create', upload.any('image'), (req, res) => {
    let dataFromPostman = req.body;
    let appartement = new Appartement(dataFromPostman);
    appartement.image = filename;
    appartement.save()
        .then((savedAppartement) => {
            filename = '';
            console.log(savedAppartement);
            res.send(savedAppartement);
        })
        .catch((error) => {
            console.log(error);
            res.send(error);
        });
});

// Récupérer tous les appartements
route.get('/all', (req, res) => {
    Appartement.find()
        .then((allAppartements) => {
            res.send(allAppartements);
        })
        .catch((error) => {
            res.send(error);
        });
});


route.get('/getbyid/:id', (req, res) => {
    let myid = req.params.id;

    // Vérifiez si myid est un ID valide
    if (!myid.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).send('ID invalide');
    }

    // Recherche de l'appartement par ID avec findById
    Appartement.findById(myid)
        .then((art) => {
            if (!art) {
                // Aucun appartement trouvé pour cet ID
                return res.status(404).send('Appartement non trouvé');
            }
            res.send(art);
        })
        .catch((err) => {
            // Gestion des erreurs
            console.error('Erreur lors de la recherche de l\'appartement :', err);
            res.status(500).send('Erreur serveur');
        });
});

// Supprimer un appartement par ID
route.delete('/supprimer/:id', (req, res) => {
    let id = req.params.id;
    appartements.findByIdAndDelete({ _id: id })
        .then((deletedAppartement) => {
            res.send(deletedAppartement);
        })
        .catch((err) => {
            res.send(err);
        });
});
route.get('/count', async (req, res) => {
    try {
      const count = await Appartement.countDocuments();
      res.json({ count });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
module.exports = route;
