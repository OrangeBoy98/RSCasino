import pool from '../db.js';

export const getUser = async (req, res, next) => {
    const { id } = req.params;
    try {
        const [user] = await pool.query(
            `SELECT * FROM Users WHERE id = ?`, [id]
        );
        res.status(200).json({user: user})
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

export const getUsers = async (req, res, next) => {
    try {
        const [users] = await pool.query(`SELECT * FROM Users`);
        res.status(200).json({users: users});
        //console.log(user);
    } catch (error) {
        res.status(500).json({error: error.message});
        next(error);
    }
};

export const updateUser = async (req, res, next) => {
    const { id } = req.params;
    const { username, email } = req.body;
    try {
        const [user] = await pool.query(
            `UPDATE Users SET username = ?, email = ? WHERE id = ?`, [username, email, id]
        );
        if (user.affectedRows > 0) {
            res.status(200).json({ id, username, email });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(400).json({error: error.message});
        next(error);
    }
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const [user] = await pool.query('DELETE FROM Users WHERE id = ?', [id]);
        if (user.affectedRows > 0) {
            res.status(204).json();
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};