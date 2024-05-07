const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const schemaUser = mongoose.Schema({
    firstname: String,
    lastname: String,
    age: Number,
    phone: Number,
    email: String,
    password: String,
});

const User = mongoose.model('User', schemaUser);
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

module.exports = User;
