import express from 'express';
import { getUserHistory } from '../controllers/history.js';

const router = express.Router();
router.get('/:id', getUserHistory);

export default router;