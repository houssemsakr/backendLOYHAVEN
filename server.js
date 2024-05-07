const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const cors = require('cors');


app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/appartement', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('MongoDB Connected');
    // Démarrez votre serveur Express ici
})
.catch((err) => {
    console.error('MongoDB Connection Error:', err);
});


// CORS configuration
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});





app.use('/getimage', express.static('./upload'));



// Routes
const appartementRoute = require('./routers/appartement.route');
const adminRoute = require('./routers/admin.route');
const usersRoute = require('./routers/users.route');
const partenaireRoute = require('./routers/partenaire.route.js');
const demandesRoute = require('./routers/demandes.route.js');
const postRoute = require('./routers/post.route.js');
// app.use('/', appartementRoute);
app.use('/admin', adminRoute);
app.use('/', usersRoute);
app.use('/appartement', appartementRoute);
app.use('/partenaire', partenaireRoute);
app.use('/demandes',demandesRoute);
app.use('/post',postRoute);


///nodeMailer

const nodemailer = require("nodemailer");

app.use(bodyParser.json());

// Route pour envoyer un e-mail
app.post("/sendmail", (req, res) => {
  console.log("Requête reçue pour envoyer un e-mail.");

  // Récupérer les données de l'utilisateur envoyées depuis Angular
  const { name, email, message } = req.body;

  // Configurer les options de l'e-mail
  const mailOptions = {
    from: email,
    to: "houssemsakhraoui@gmail.com",
    subject: "New Contact Form Submission",
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
  };

  // Créer un transporteur nodemailer
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: 'houssemsakhraoui@gmail.com',
      pass: 'jril ocmp nxja uwjl'
    }
  });

  // Envoyer l'e-mail
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Erreur lors de l'envoi de l'e-mail :", error);
      res.status(500).send("Erreur lors de l'envoi de l'e-mail.");
    } else {
      console.log("E-mail envoyé avec succès :", info.response);
      res.status(200).send("E-mail envoyé avec succès.");
    }
  });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
