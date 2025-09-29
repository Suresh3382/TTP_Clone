import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from "express";
import { UserModel } from '../Models/UserModel';

export interface JwtPayload {
    id: string,
}

export const CheckAuth = async (req: any, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, process.env.ACCESS_SECRET!) as JwtPayload;
        if (!decoded) {
            return res.status(401).json({ success: false, message: 'Invalid Access Token' });
        }
        const authUser = await UserModel.findById(decoded.id);      
        if (!authUser) {
            return res.status(403).json({ success: false, message: 'Access Token Expired' });
        }
        req.user = authUser;
        next();
    }
    catch (err: any) {
        return res.status(500).json({ success: false, authError: true, message: 'Authentication Error', error: err.message });
    }
}

export const CheckRefreshToken = async (req: any, res: Response, next: NextFunction) => {
    try {
        const token = req.params.refreshToken;
        const decode = jwt.verify(token, process.env.REFRESH_SECRET!) as JwtPayload;
        if (!decode) {
            return res.status(401).json({ success: false, message: 'Invalid Refresh Token' });
        }
        const authUser = await UserModel.findById(decode.id);
        if (!authUser) {
            return res.status(403).json({ success: false, message: 'Refresh Token Expired' });
        }
        req.user = authUser;
        next();
    } catch (error: any) {
        return res.status(500).json({ success: false, authError: true, message: 'Authentication Error', error: error.message });
    }
}
