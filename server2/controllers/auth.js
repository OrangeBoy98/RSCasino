import { createError } from "../utils/error.js";
import jwt from 'jsonwebtoken'; 
import pool from '../db.js'; 
import bcrypt from "bcryptjs"; 
import dotenv from 'dotenv'; 
dotenv.config(); 
export const register = async (req, res, next) => { 
    const { username, email, password, phone } = req.body; 
    console.log(`register: ${username}, ${email}, ${password}, ${phone}`); 
    try { 
        const hashedPassword = await bcrypt.hash(password, 10); 
        const [result] = await pool.query('INSERT INTO Users (username, email, password, phone) VALUES (?, ?, ?, ?)', [username, email, hashedPassword, phone]); 
        res.status(200).json({ success: true, message: "User has been created." }); 
    } catch (error) { 
        res.status(400).json({ error: error.message }); 
		next(error);
    } 
};
export const login = async (req, res, next) => { 
    try { 
        const [rows] = await pool.query('SELECT id, username, email, password FROM Users WHERE email = ?', [req.body.email]); 
        if (rows.length === 0) { 
            return res.status(404).json({ error: 'User not found' }); 
        } 
        const user = rows[0]; 
        console.log(user); 
        const isMatch = await bcrypt.compare(req.body.password, user.password); 
        console.log(isMatch); 
        if (!isMatch) { 
            return res.status(400).json({ error: 'Invalid credentials' }); 
        } 
		const token = jwt.sign(
			{ id: user.id, isAdmin: user.isAdmin },
			process.env.JWT,
			{ expiresIn: '1h' } // 토큰 만료 시간 설정
		);
		const { password, isAdmin, ...otherDetails } = user;
		res.cookie("access_token", token, {
            httpOnly: true, 
            sameSite: 'strict', 
            path: '/', 
		}).status(200).json({details: {...otherDetails}, isAdmin, token});
        //domain: 'moblecasino.xyz',
    } catch (error) { 
        res.status(500).json({ error: error.message });
		next(error);
    } 
};

export const logout = (req, res) => {
	res.clearCookie("access_token", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		path: '/',
		sameSite: 'strict',
	}).status(200)
		.json({message: "Logged out successfully"});
};

export const duplicateCheck = async (req, res) => {
    const username = req.params.id;
    try {
        const [rows] = await pool.query('SELECT username FROM Users WHERE username = ?', [username]);
        if (rows.length === 0) {
            res.status(200).json({ message: 'possible' });
        } else {
            res.status(200).json({ message: 'impossible' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
};