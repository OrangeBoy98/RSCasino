import express from 'express';
import { login, register, logout, duplicateCheck } from '../controllers/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.post('/logout', logout);
router.get('/duplicateCheck/:id', duplicateCheck);

export default router;