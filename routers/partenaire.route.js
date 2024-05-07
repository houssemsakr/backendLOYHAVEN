const express = require('express');
const route =require('express'). Router()
const Partenaire = require('../models/partenaire.model');
require('dotenv').config()
const multer = require('multer');
const partenairs = require('../models/Partenaire');
// Configurer le stockage pour les fichiers image
let filename = '';
const storage = multer.diskStorage({
    destination: './upload',
    filename: (req, file, cb) => {
        let date = Date.now();
        let fl = date + '.' + file.mimetype.split('/')[1];
        cb(null, fl);
        filename = fl;
    }
});

// Initialiser multer avec le stockage défini
const upload = multer({ storage: storage });

// Créer un nouvel appartement avec upload d'image
route.post('/create', upload.any('image'), (req, res) => {
    let dataFromPostman = req.body;
    let partenaire = new Partenaire(dataFromPostman);
    partenaire.image = filename;
    partenaire.save()
        .then((savedPartenaire) => {
            filename = '';
            console.log(savedPartenaire);
            res.send(savedPartenaire);
        })
        .catch((error) => {
            console.log(error);
            res.send(error);
        });
});


route.get('/getbyid/:id', (req, res) => {
    let myid = req.params.id;

    // Vérifiez si myid est un ID valide
    if (!myid.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).send('ID invalide');
    }

    // Recherche de partenaire par ID avec findById
    Partenaire.findById(myid)
        .then((art) => {
            if (!art) {
                // Aucun partenaire trouvé pour cet ID
                return res.status(404).send('partenaire non trouvé');
            }
            res.send(art);
        })
        .catch((err) => {
            // Gestion des erreurs
            console.error('Erreur lors de la recherche de l\partenaire :', err);
            res.status(500).send('Erreur serveur');
        });
});

// Obtenir tous les partenaires
route.get('/all', (req, res) => {
    Partenaire.find()
        .then(allPartenaires => {
            res.status(200).json(allPartenaires);
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
});

// Supprimer un partenaire par ID
route.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    Partenaire.findByIdAndDelete(id)
        .then(deletedPartenaire => {
            if (deletedPartenaire) {
                res.status(200).json({ message: 'Partenaire deleted successfully' });
            } else {
                res.status(404).json({ message: 'Partenaire not found' });
            }
        })
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
});
route.get('/count', async (req, res) => {
    try {
      const count = await Partenaire.countDocuments();
      res.json({ count });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
module.exports = route;
