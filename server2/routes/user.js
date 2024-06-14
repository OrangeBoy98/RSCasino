import express from 'express';
import { getUser, getUsers, updateUser, deleteUser } from '../controllers/user.js'
import { verifyUser, verifyAdmin } from '../utils/verifyToken.js';

const router = express.Router();

router.get('/:id', verifyUser, getUser);
router.get('/', getUsers);
router.put('/:id', verifyUser, updateUser);
router.delete('/:id', deleteUser);

export default router;