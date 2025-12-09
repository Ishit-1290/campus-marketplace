// src/controllers/auth.controller.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import * as userService from '../services/user.service.js';

const SALT_ROUNDS = 10;

export async function register(req, res, next) {
    try {
        const {
            name,
            email,
            password,
            college_name,
            phone,
            role
        } = req.body;
        const existing = await userService.getUserByEmail(email);
        if (existing) return res.status(400).json({
            message: 'Email already in use'
        });
        const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
        const user = await userService.createUser({
            name,
            email,
            password_hash,
            college_name,
            phone,
            role: role
        });
        res.status(201).json({
            user
        });
    } catch (err) {
        next(err);
    }
}

export async function login(req, res, next) {
    try {
        const {
            email,
            password
        } = req.body;
        const userRow = await userService.getUserByEmail(email);
        if (!userRow) return res.status(400).json({
            message: 'Invalid credentials'
        });
        const ok = await bcrypt.compare(password, userRow.password_hash);
        if (!ok) return res.status(400).json({
            message: 'Invalid credentials'
        });

        // fetch roles
        // const userWithRoles = await userService.getUserWithRolesById(userRow.id);

        // sign token (include roles)
        const payload = {
            id: userRow.user_id,
            email: userRow.email,
            roles: userRow.role
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || '7d'
        });
        // set cookie   
        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // set to true in production with HTTPS
            sameSite: "lax",
            maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
        })
        res.json({
            success: true,
            message: 'Logged in'
        });
    } catch (err) {
        next(err);
    }
}

// endpoint to add seller role to current user
export async function becomeSeller(req, res, next) {
    try {
        const uid = req.user.id;
        await userService.addRoleToUser(uid, 'seller');
        const user = await userService.getUserById(uid);
        res.json({
            success: true,
            user
        });
    } catch (err) {
        next(err);
    }
}

// optional: current user info
export async function me(req, res, next) {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not logged in"
            });
        }
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userService.getUserById(payload.id);
        res.json({
            success: true,
            user
        });

    } catch (err) {
        return res.json({
            success: false,
            message: "Invalid token"
        });
        
    }
}
export async function logout(req, res, next) {
    try {
        res.clearCookie("token");
        res.json({ success: true, message: "Logged out" });
    } catch (err) {
        next(err);
    }
}