import pool from '../db.js'; 
import dotenv from 'dotenv';

dotenv.config();

export const getUserHistory = async (req, res, next) => {
    try {
        const [history] = await pool.query(`SELECT * FROM Histories WHERE id = ?`, [req.params.id]);
        res.json(history);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
        next(err);
    }
}