const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Définition du schéma de l'administrateur
const adminSchema = mongoose.Schema({
    username: String,
    email: String,
    password: String
});

// URL de la base de données
let url= process.env.URL
var privateKey=process.env.PRIVATE_KEY 


// Modèle de l'administrateur
const Admin = mongoose.model('admin', adminSchema);

// Fonction pour enregistrer un administrateur
exports.registerAdmin = (username, email, password) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url)
            .then(() => {
                return Admin.findOne({ email: email });
            })
            .then((doc) => {
                if (doc) {
                    
                    reject('This email is already registered');
                } else {
                    bcrypt.hash(password, 10)
                        .then((hashedPassword) => {
                            const admin = new Admin({
                                username: username,
                                email: email,
                                password: hashedPassword
                            });
                            return admin.save();
                        })
                        .then((admin) => {
                           
                            resolve(admin);
                        })
                        .catch((err) => {
                        
                            reject(err);
                        });
                }
            })
            .catch((err) => {
                reject(err);
            });
    });
};

// Fonction pour connecter un administrateur
// Fonction pour connecter un administrateur
exports.loginadmin = (email, password) => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url)
            .then(() => {
                return Admin.findOne({ email: email });
            })
            .then((admin) => {
                if (!admin) {
                    
                    reject("We don't have this email in our database");
                } else {
                    bcrypt.compare(password, admin.password)
                        .then((same) => {
                            if (same) {
                                let token = jwt.sign({ id: admin._id, username: admin.username, email:admin.email,role:'Admin'}, privateKey, {
                                    expiresIn: '1h',
                                });
                                
                                resolve({token:token,role:'Admin',username: admin.username});
                            } else {
                               
                                reject('Invalid password');
                            }
                        })
                        .catch((err) => {
                           
                            reject(err);
                        });
                }
            })
            .catch((err) => {
                reject(err);
            });
    });
};
