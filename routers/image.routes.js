var multer = require('multer');
var DIR = './uploads/';
var upload = multer({dest: DIR}).single('photo');

module.exports = function(app) {

    var images = require('../controllers/image.controller.js');

    // Create a new image
    app.post('/images', images.create);

    // Retrieve all images
    app.get('/images', images.findAll);

    // Retrieve a single image with imageId
    app.get('/images/:imageId', images.findOne);

    // Update a image with imageId
    app.put('/images/:imageId', images.update);

    // Delete a image with imageId
    app.delete('/images/:imageId', images.delete);

    app.post('/upload', function (req, res, next) {
        var path = '';
        upload(req, res, function (err) {
           if (err) {
             // An error occurred when uploading
             console.log(err);
             return res.status(422).send("an Error occured")
           }  
           file_name = req.file.filename;
           destination = req.file.destination;
           res.send({file_name : file_name,destination: destination});     
          });     
   })
    
}