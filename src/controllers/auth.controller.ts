import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.model';

const signToken = (id: string, role: string) =>
    jwt.sign({ id, role }, process.env.JWT_SECRET as string, { expiresIn: '7d' });

export const register = async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ username, email, password: hashed });
    const token = signToken(user._id.toString(), user.role);
    res.status(201).json({ token, user: { id: user._id, username, email, role: user.role } });
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
        return res.status(401).json({ message: 'Invalid credentials' });
    if (user.isBanned)
        return res.status(403).json({ message: 'Account suspended' });
    const token = signToken(user._id.toString(), user.role);
    res.json({ token, user: { id: user._id, username: user.username, email, role: user.role } });
};