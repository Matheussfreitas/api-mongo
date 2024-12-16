import express from 'express';
import mongoose from "mongoose";
import User from '../models/user.js';
const router = express.Router();

router.route('/users')
.get( async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ err: "Erro interno do servidor" });
    }
})
.post( async (req, res) => {
    try {
        const { name, age, email } = req.body;
        if (!name || !age || !email) {
            return res.status(400).json({ err: "Todos os campos obrigatórios devem ser preenchidos" });
        }
        const user = new User({ name, age, email });
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json(err);
    }
});

router.route('/users/:id')
.get( async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ err: "ID inválido" });
        }
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ err: "Usuário não encontrado" });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ err: "Erro interno do servidor "});
    }
})
.put('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, age, email } = req.body;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ err: "ID inválido" });
        }
        if (!name && !age && !email) {
            return res.status(400).json({ err: "Dados incompletos para atualização" });
        }
        const updateUser = await User.findByIdAndUpdate(
            id,
            { name, age, email },
            { new: true, runValidators: true }
        );
        if (!updateUser) {
            return res.status(404).json({ err: "Usuário não encontrado" });
        }
        res.status(200).json(updateUser);
    } catch (err) {
        res.status(500).json({ err: "Erro interno do servidor" });
    }
})

export default router;