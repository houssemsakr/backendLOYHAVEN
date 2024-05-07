const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Schéma du modèle Post
const postSchema = new Schema({
  title: String,
  body: String
});

// Créer le modèle Post à partir du schéma
const Post = mongoose.model('Post', postSchema);

module.exports = Post;
