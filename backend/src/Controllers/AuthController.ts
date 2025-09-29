import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { UserModel } from "../Models/UserModel";
import jwt from 'jsonwebtoken';
import { JwtPayload } from "../MiddleWares/AuthMiddleware";
import { Onboadring } from "../Services/UserServices";
import { log } from "console";

const generateAccessToken = (id: string) => {
    return jwt.sign({ id }, process.env.ACCESS_SECRET!, { expiresIn: '5m' });
};

const generateRefreshToken = (id: string) => {
    return jwt.sign({ id }, process.env.REFRESH_SECRET!, { expiresIn: '5d' });
};

export const Signup = async (req: Request, res: Response) => {
    try {
        const { username, email, password, role, onboardingComplete } = req.body;
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'User with this email already exists!' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({ username, email, password: hashedPassword, role, onboardingComplete });
        await newUser.save();
        res.status(200).json({ success: true, message: 'Signup success!' })
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

export const Login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const existingUser = await UserModel.findOne({ username });
        if (!existingUser) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Invalid Credentials' });
        }
        const accessToken = generateAccessToken(existingUser._id.toString());
        const refreshToken = generateRefreshToken(existingUser._id.toString());
        existingUser.refreshToken = refreshToken;
        existingUser.save();
        res.status(200).json({
            success: true,
            message: "Login Successfully",
            result: {
                _id: existingUser._id,
                accessToken,
                refreshToken,
                user: existingUser.username,
                role: existingUser.role,
                Onboadring: existingUser.onboardingComplete
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error });
    }
};

export const RefreshToken = async (req: Request, res: Response) => {
    const { refreshToken } = req.params;
    if (!refreshToken) {
        return res.status(400).json({ success: false, message: 'Refresh Token is required' });
    }
    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET!) as JwtPayload;
        const existingUser = await UserModel.findById(decoded.id);
        if (!existingUser || existingUser.refreshToken !== refreshToken) {
            return res.status(403).json({ success: false, message: 'Invalid Refresh Token' });
        }
        const accessToken = generateAccessToken(existingUser._id.toString());
        res.status(200).json({ success: true, message: 'New AccessToken Created', accessToken: accessToken });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const ChangePassword = async (req: any, res: Response) => {
    const { userId, currentPassword, updatedPassword } = req.body;
    try {
        const user = await UserModel.findById(userId);
        if (user) {
            const isValid = await bcrypt.compare(currentPassword, user.password);
            if (isValid) {
                const hashedPassword = await bcrypt.hash(updatedPassword, 10);
                user.password = hashedPassword
                await user.save();
                return res.status(200).json({ success: true, message: 'Password changed successfully!' })
            }
            return res.status(400).json({ success: false, message: 'Invalid Password' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error', error });
    }
}

