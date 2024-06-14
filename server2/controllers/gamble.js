import CryptoJS from "crypto-js";
import pool from '../db.js'; 
import dotenv from 'dotenv';

dotenv.config();

export const randomGamble = async (req, res, next) => {
    const { id } = req.params;
    const { betAmount, result } = req.body;

    if (!betAmount || isNaN(betAmount) || betAmount <= 0) {
        return res.status(400).json({ message: 'Invalid bet amount' });
    }

    try {
        const [rows] = await pool.query('SELECT id, money FROM Users WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        const user = rows[0];

        if (betAmount > user.money) {
            return res.status(400).json({ message: 'Insufficient funds' });
        }

        user.money -= betAmount;
        user.money += result;

        await pool.query('UPDATE Users SET money = ? WHERE id = ?', [user.money, id]);

        const dataToEncrypt = JSON.stringify({ newBalance: user.money, result: result });
        const encryptedData = CryptoJS.AES.encrypt(dataToEncrypt, process.env.SECRET_KEY).toString();

        // 배팅 히스토리 저장
        await pool.query('INSERT INTO Histories (userId, betAmount, result, betType) VALUES (?, ?, ?, ?)', [id, betAmount, result, 'Rulette']);

        res.json({ data: encryptedData });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const bet = async (req, res, next) => {
    const { userId, amount } = req.body;
    //console.log(req.body);

    try {
        const [slotRows] = await pool.query(
            'SELECT * FROM Slots WHERE winner IS NULL ORDER BY roundNumber DESC LIMIT 1'
        );
        let currentSlot = slotRows[0];

        await pool.query(
            'UPDATE Users SET money = money - ? WHERE id = ?',
            [amount, userId]
        );

        if (!currentSlot) {
            const [newSlotResult] = await pool.query(
                'INSERT INTO Slots (roundNumber) VALUES (1)'
            );
            currentSlot = { id: newSlotResult.insertId, roundNumber: 1 };
        }

        await pool.query(
            'INSERT INTO Bets (slot_id, user_id, amount) VALUES (?, ?, ?)',
            [currentSlot.id, userId, amount]
        );

        await pool.query(
            'INSERT INTO Histories (userId, betAmount, result, betType) VALUES (?, ?, ?, ?)',
            [userId, amount, -amount, 'Slot']
        );

        res.status(200).json(currentSlot);
    } catch (err) {
        next(err);
    }
};

export const slot = async (req, res, next) => {
    try {
        const [slotRows] = await pool.query(
            'SELECT * FROM Slots WHERE winner IS NULL ORDER BY roundNumber DESC LIMIT 1'
        );
        const currentSlot = slotRows[0];

        const [betsRows] = await pool.query(
            'SELECT * FROM Bets WHERE slot_id = ?',
            [currentSlot.id]
        );
        const bets = betsRows;

        if (bets.length > 0) {
            const winnerBet = bets[Math.floor(Math.random() * bets.length)];
            await pool.query(
                'UPDATE Slots SET winner = ? WHERE id = ?',
                [winnerBet.user_id, currentSlot.id]
            );

            const totalAmount = bets.reduce((sum, bet) => sum + bet.amount, 0);
            await pool.query(
                'UPDATE Users SET money = money + ? WHERE id = ?',
                [totalAmount, winnerBet.user_id]
            );

            await pool.query(
                'INSERT INTO Histories (userId, betAmount, result, betType) VALUES (?, ?, ?, ?)',
                [winnerBet.user_id, totalAmount, totalAmount, 'Slot']
            );

            await pool.query(
                'INSERT INTO Slots (roundNumber) VALUES (?)',
                [currentSlot.roundNumber + 1]
            );

            res.status(200).json({ winner: winnerBet.user_id, amount: totalAmount });
        } else {
            res.status(400).json({ message: 'No bets placed in this round.' });
        }
    } catch (err) {
        next(err);
    }
};


export const getBets = async (req, res, next) => {
    try {
        const [slotRows] = await pool.query(
            'SELECT * FROM Slots WHERE winner IS NULL ORDER BY roundNumber DESC LIMIT 1'
        );
        const currentSlot = slotRows[0];

        const [betsRows] = await pool.query(
            'SELECT * FROM Bets WHERE slot_id = ?',
            [currentSlot.id]
        );

        res.status(200).json(betsRows);
    } catch (err) {
        next(err);
    }
};


export const getRounds = async (req, res, next) => {
    try {
        const [slotsRows] = await pool.query(
            'SELECT * FROM Slots WHERE winner IS NOT NULL ORDER BY roundNumber DESC'
        );

        const rounds = await Promise.all(
            slotsRows.map(async (slot) => {
                const [winnerRow] = await pool.query(
                    'SELECT * FROM Users WHERE id = ?',
                    [slot.winner]
                );
                return {
                    ...slot,
                    winner: winnerRow[0]
                };
            })
        );

        res.status(200).json(rounds);
    } catch (err) {
        next(err);
    }
};
