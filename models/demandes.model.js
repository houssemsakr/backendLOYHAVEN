const express = require('express');
const mongoose=require('mongoose')
require('dotenv').config()

const schemaDemandes = mongoose.Schema({
    name: String,
    postedBy: String,
    price: Number,
    phone: Number,
    email: String,
    description: String,
    image: String
});

const Demandes = mongoose.model('Demandes', schemaDemandes);
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

module.exports = Demandes;

