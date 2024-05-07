const express = require('express');
const route = require('express').Router();
const usersModel = require('../models/users.model');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User.model');


const privateKey = process.env.PRIVATE_KEY;
const secretKey = process.env.SECRET_KEY;
const clientKey = process.env.CLIENT_KEY;

const verifyToken = (req, res, next) => {
    let token = req.headers.authorization;
    if (!token) {
        return res.status(400).json({ msg: 'Access rejected. Token missing.' });
    }
    try {
        jwt.verify(token, privateKey);
        next();
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
};

const verifyTokenAdmin = (req, res, next) => {
    let token = req.headers.authorization;
    let role = req.headers.role;
    if (!token || role !== 'Admin') {
        return res.status(400).json({ msg: 'Access rejected. Invalid token or role.' });
    }
    try {
        jwt.verify(token, privateKey);
        next();
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }
};

const verifySecretClient = (req, res, next) => {
    let sk = req.query.secret;
    let ck = req.query.client;
    if (sk === secretKey && ck === clientKey) {
        next();
    } else {
        res.status(400).json({ error: "Access denied. Invalid secret key or client key." });
    }
};

route.get('/', (req, res, next) => {
    res.send('Welcome');
});
route.post('/register', (req, res, next)=>{
    usersModel.register(req.body.firstname, req.body.lastname, req.body.age, req.body.phone, req.body.email, req.body.password)
    .then((user)=>res.status(200).json({user:user, msg: "added !!"}))
    .catch((err)=>res.status(400).json({error:err}))
})

route.post('/login', (req, res, next)=>{
   usersModel.login(req.body.email,req.body.password)
   .then((token)=>res.status(200).json({token:token}))
   .catch((err)=>res.status(400).json({error:err}))
})



route.get('/users', verifyToken, verifySecretClient, (req, res, next) => {
    usersModel.getAllUser()
        .then((doc) => res.status(200).json(doc))
        .catch((err) => res.status(400).json(err));
});

route.get('/user/:id', verifyToken, verifySecretClient, (req, res, next) => {
    usersModel.getOneUser(req.params.id)
        .then((doc) => res.status(200).json(doc))
        .catch((err) => res.status(400).json(err));
});

route.delete('/user/:id', verifyToken, verifySecretClient, (req, res, next) => {
    usersModel.deleteOneUser(req.params.id)
        .then((doc) => res.status(200).json(doc))
        .catch((err) => res.status(400).json(err));
});

route.get('/count', async (req, res) => {
    try {
      const count = await User.countDocuments();
      res.json({ count });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  

module.exports = route;
