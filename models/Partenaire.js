const express = require('express');
const mongoose=require('mongoose')
require('dotenv').config()


const partenaireSchema = mongoose.Schema({
    firstname: String,
    lastname: String,
    adresse: String,
    Job: String,
    phone: Number,
    email: String,
    description: String,
    image: String
});


const Partenaire = mongoose.model('partenaire', partenaireSchema);
let url= process.env.URL

exports.testConnect=()=>{
return new Promise((resolve, reject)=>{
mongoose.connect(url).then((err, stats) => {
    if (err) {
        reject(err);
    } else {
        resolve('Connected to MongoDB');
    }
});
});
};

module.exports = Partenaire;

