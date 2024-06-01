import User from "../models/User.js";
import CryptoJS from "crypto-js";
import dotenv from 'dotenv';
import History from "../models/History.js";
import Slot from "../models/Slot.js";

dotenv.config();

export const randomGamble = async (req, res, next) => {
    const { betAmount, result } = req.body;

    if (!betAmount || isNaN(betAmount) || betAmount <= 0) {
        return res.status(400).json({ message: 'Invalid bet amount' });
    }

    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (betAmount > user.money) {
            return res.status(400).json({ message: 'Insufficient funds' });
        }

        user.money -= betAmount;
        user.money += result;

        await user.save();

        const dataToEncrypt = JSON.stringify({ newBalance: user.money, result: result });
        const encryptedData = CryptoJS.AES.encrypt(dataToEncrypt, process.env.SECRET_KEY).toString();

        // 배팅 히스토리 저장
        const newHistory = new History({
            userId: user._id,
            betAmount: betAmount,
            result: result,
            betType: 'Rulette'
        });
        await newHistory.save();

        res.json({ data: encryptedData });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const bet = async (req, res, next) => {
    const { userId, amount } = req.body;
    console.log(req.body);

    try {
        let currentSlot = await Slot.findOne({ winner: null }).sort({ roundNumber: -1 }).limit(1);
        await User.findOneAndUpdate({ _id: userId }, { $inc: { money: -amount } });

        if (!currentSlot) {
            const newSlot = new Slot({ roundNumber: 1 });
            currentSlot = await newSlot.save();
        }

        const bet = {
            user: userId,
            amount: amount,
        };

        const newHistory = new History({
            userId: userId,
            betAmount: amount,
            result: -amount, // 베팅시 결과는 음수로 기록
            betType: 'Slot'
        });
        await newHistory.save();

        currentSlot.bets.push(bet);
        await currentSlot.save();

        res.status(200).json(currentSlot);
    } catch (err) {
        next(err); // 에러가 발생했을 때만 next를 호출합니다.
    }
};

export const slot = async (req, res, next) => {
    try {
        const currentSlot = await Slot.findOne({ winner: null }).sort({ roundNumber: -1 }).limit(1);
        const bets = currentSlot.bets;

        if (bets.length > 0) {
            const winnerBet = bets[Math.floor(Math.random() * bets.length)];
            currentSlot.winner = winnerBet.user;
            await currentSlot.save();

            const totalAmount = bets.reduce((sum, bet) => sum + bet.amount, 0);
            const winner = await User.findById(winnerBet.user);
            winner.money += totalAmount;
            await winner.save();

            const winHistory = new History({
                userId: winner._id,
                betAmount: totalAmount,
                result: totalAmount, // 승리 금액 기록
                betType: 'Slot'
            });
            await winHistory.save();

            // 새로운 회차 생성
            const newSlot = new Slot({ roundNumber: currentSlot.roundNumber + 1 });
            await newSlot.save();

            res.status(200).json({ winner: winner.username, amount: totalAmount });
        } else {
            res.status(400).json({ message: 'No bets placed in this round.' });
        }
    } catch (err) {
        next(err); // 에러가 발생했을 때만 next를 호출합니다.
    }
};

export const getBets = async (req, res, next) => {
    try {
        const currentSlot = await Slot.findOne({ winner: null }).sort({ roundNumber: -1 }).limit(1).populate('bets.user');
        res.status(200).json(currentSlot.bets);
    } catch (err) {
        next(err); // 에러가 발생했을 때만 next를 호출합니다.
    }
};

export const getRounds = async (req, res, next) => {
    try {
        const slots = await Slot.find({ winner: { $ne: null } }).sort({ roundNumber: -1 }).populate('winner');
        res.status(200).json(slots);
    } catch (err) {
        next(err); // 에러가 발생했을 때만 next를 호출합니다.
    }
};
