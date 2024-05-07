const express = require('express');
const route = express.Router();
const Post = require('../models/post.model');


// Création d'une nouvelle publication
route.post('/', async (req, res) => {
    try {
        const { title, body } = req.body;
        const post = new Post({ title, body });
        const savedPost = await post.save();
        res.status(201).json({ message: 'Post created successfully', post: savedPost });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route pour récupérer les publications avec des détails
route.get('/withDetails', async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route pour supprimer une publication par son ID
route.delete('/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;
        const deletedPost = await Post.findByIdAndDelete(postId);
        if (!deletedPost) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json({ message: 'Post deleted successfully', post: deletedPost });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route pour récupérer une publication par son ID
route.get('/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = route;
