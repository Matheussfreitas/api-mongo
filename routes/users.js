const express = require('express');
const router = express.router();
const User = require('./models/User');

router.post('/users', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).send(user);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get('/users', async (req, res) => {
    const users = await User.find();
    res.send(users);
});

module.exports = router;