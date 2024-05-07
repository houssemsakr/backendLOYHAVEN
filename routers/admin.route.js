const express = require('express');
const route = require('express').Router(); // Utilisez router au lieu de route
const adminModel = require('../models/admin.model');
require('dotenv').config()

route.post('/register', (req, res, next) => {
    adminModel.registerAdmin(req.body.username, req.body.email, req.body.password)
        .then((user) => res.status(200).json({ user: user, msg: "added !!" }))
        .catch((err) => res.status(400).json({ error: err }));
});

route.post('/login', (req, res, next) => {
    adminModel.loginadmin(req.body.email, req.body.password)
        .then((doc) => res.status(200).json(doc))
        .catch((err) => res.status(400).json({ error: err }));
});

module.exports = route;
