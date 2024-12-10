import express from 'express';
const router = express.Router();
import User from '../models/user.js';

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

export default router;