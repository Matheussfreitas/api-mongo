import express from 'express';
import {Request, Response} from 'express';
import mongoose from "mongoose";
import User, {IUser} from '../models/user';

const router = express.Router();

router.get('/teste', async (req: Request, res: Response) => {
    res.status(200).json({ OK: true });
    return 
})

router.route('/users')
.get( async (req: Request, res: Response) => {
    try {
        const { name, age, email, page, limit } = req.query;

        const filter: Record<string, any> = {};
        if (name) filter.name = new RegExp(name as string, 'i');
        if (email) filter.email = email;
        if (age) filter.age = age;

        // Configura a paginação opcional
        const pageNumber = parseInt(page as string) || 1;
        const limitNumber = parseInt(limit as string) || 10;
        const skip = (pageNumber - 1) * limitNumber;

        const users: IUser[] = await User.find(filter)
        .skip(skip)
        .limit(limitNumber);

        const totalDocuments = await User.countDocuments(filter);

        res.json({
            totalDocuments,
            currentPage: pageNumber,
            totalPages: Math.ceil(totalDocuments / limitNumber),
            users,
        });
    } catch (err) {
        res.status(500).json({ err: "Erro interno do servidor" });
    }
})
.post( async (req: Request, res: Response) => {
    try {
        const { name, age, email } = req.body as Partial<IUser>;
        if (!name || !age || !email) {
            res.status(400).json({ err: "Todos os campos obrigatórios devem ser preenchidos" });
            return;
        }
        const user = new User({ name, age, email });
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json(err);
    }
});

router.route('/users/:id')
.get( async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { fields } = req.query;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ err: "ID inválido" });
            return;
        }

        const projection = fields ? fields.toString().split(',').join(' ') : '';
        const user: IUser | null = await User.findById(id).select(projection);

        if (!user) {
            res.status(404).json({ err: "Usuário não encontrado" });
            return;
        }

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ err: "Erro interno do servidor" });
    }
})
.put( async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, age, email } = req.body;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({ err: "ID inválido" });
            return;
        }
        if (!name && !age && !email) {
            res.status(400).json({ err: "Dados incompletos para atualização" });
            return;
        }
        const updateUser: IUser | null = await User.findByIdAndUpdate(
            id,
            { name, age, email },
            { new: true, runValidators: true }
        );
        if (!updateUser) {
            res.status(404).json({ err: "Usuário não encontrado" });
            return;
        }
        res.status(200).json(updateUser);
    } catch (err) {
        res.status(500).json({ err: "Erro interno do servidor" });
    }
})

export default router;