import express from 'express';
import { verifyPayment } from '../controllers/payment.js';

const router = express.Router();

router.post('/verifyIamport/:imp_uid', verifyPayment);

export default router;
