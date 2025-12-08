import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

import User from '../models/user.model.js';

export const register = async (req, res) => {
    try {
        const { fullname, email, password } = req.body;

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                success: false,
                message: 'Email đã được đăng ký!' });
        }

        const hashedPassword = bcrypt.hashSync(password, 10);
        const newUser = new User({ fullname, email, password: hashedPassword });

        const user = await newUser.save();
        res.status(201).json({ 
            success: true, 
            message: 'Đăng ký thành công!' 
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email không hợp lệ' 
            });
        }
        
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ 
                success: false, 
                message: 'Mật khẩu không đúng' 
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ 
            success: true, 
            message: 'Đăng nhập thành công',
            token
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}

export const logout = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: 'Đăng xuất thành công'
        });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}