import History from "../models/History.js";

export const getUserHistory = async (req, res, next) => {
    try {
        const history = await History.find({ userId: req.params.id });
        res.json(history);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
        next(err);
    }
}