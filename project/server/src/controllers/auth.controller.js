import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

import User from '../models/user.model.js';
import UserExp from '../models/userExp.model.js';
import UserProgress from '../models/userProgress.model.js';

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
        console.log('User created successfully:', user._id);

        // Automatically create userExp with default values
        let userExp = null;
        let userProgress = null;
        let errors = [];

        try {
            userExp = new UserExp({
                userId: user._id,
                exp: 0,
                level: 1,
                levelName: 'Mầm non',
                streak: 0,
                lastStreakDate: new Date(),
                totalLessonsCompleted: 0,
                totalWordsLearned: 0
            });
            await userExp.save();
            console.log('UserExp created successfully for user:', user._id);
        } catch (expErr) {
            console.error('Error creating userExp:', expErr);
            errors.push(`userExp: ${expErr.message}`);
            // Try to continue, but log the error
        }

        // Automatically create userProgress with default values
        try {
            userProgress = new UserProgress({
                userId: user._id,
                completedLessons: [],
                currentTopic: 1,
                currentLesson: 1,
                unlockedTopics: [1],
                lastActivity: new Date(),
                totalStudyTime: 0,
                lastStudyDate: new Date()
            });
            await userProgress.save();
            console.log('UserProgress created successfully for user:', user._id);
        } catch (progressErr) {
            console.error('Error creating userProgress:', progressErr);
            errors.push(`userProgress: ${progressErr.message}`);
            // Try to continue, but log the error
        }

        // If both failed, return error
        if (!userExp && !userProgress) {
            console.error('Failed to create both userExp and userProgress for user:', user._id);
            return res.status(500).json({ 
                success: false, 
                message: 'Đăng ký thành công nhưng không thể khởi tạo dữ liệu người dùng',
                errors: errors
            });
        }

        res.status(201).json({ 
            success: true, 
            message: 'Đăng ký thành công!',
            data: {
                user: {
                    id: user._id,
                    fullname: user.fullname,
                    email: user.email
                },
                userExp: userExp ? {
                    exp: userExp.exp,
                    level: userExp.level,
                    levelName: userExp.levelName
                } : null,
                userProgress: userProgress ? {
                    currentTopic: userProgress.currentTopic,
                    currentLesson: userProgress.currentLesson
                } : null,
                warnings: errors.length > 0 ? errors : undefined
            }
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