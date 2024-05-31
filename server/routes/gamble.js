import express from 'express';
import { randomGamble, bet, slot, getBets, getRounds } from '../controllers/gamble.js';
import { verifyUser } from '../utils/verifyToken.js';
import { decryptData } from '../utils/decrypto.js';

const router = express.Router();

router.post('/random/:id', decryptData, verifyUser, randomGamble);
router.get('/bets', verifyUser, getBets);
router.get('/rounds', verifyUser, getRounds);
router.post('/bet', verifyUser, bet);
router.post('/round/complete', verifyUser, slot);

export default router;