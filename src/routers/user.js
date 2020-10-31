const express = require('express');
const User = require('../models/user');
const auth = require('../middlewares/auth');
const multer = require('multer');
const router = new express.Router();

router.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        const token = await user.generateAuthToken();
        await user.save();
        res.status(201).send({user, token});
    } catch(e) {
        res.status(400).send(e)
    }
});

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({user, token});
    } catch(e) {
        res.status(400).send()
    }
});

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        });
        await req.user.save();

        res.send();
    } catch(e) {
        res.status(500).send();
    }
});

router.post('/users/logoutall', auth, async(req, res) => {
    try {
        req.user.tokens = []
        await req.user.save();

        res.send()
    } catch(e) {
        res.status(500).send()
    }
});

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user);
});

router.patch('/users/me',auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'age', 'password']
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update));

    if(!isValidUpdate) {
        return res.status(400).send({error: 'Invalid updates!'});
    }
    try {
        updates.forEach((update) => req.user[update] =  req.body[update]);
        await req.user.save();
        res.send(req.user)
    } catch(e) {
        res.status(400).send(e);
    }
});

router.delete('/users/me',auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user);
    } catch(e) {
        res.status(500).send(e)
    }
});

const upload = multer({
    dest: 'avatars'
});

router.post('/users/me/avatar', upload.single('avatar'), (req,res) => {
    res.send()
});

module.exports = router