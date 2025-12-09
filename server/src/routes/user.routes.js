// src/routes/user.routes.js
import express from 'express';
import { authRequired, adminOnly } from '../middleware/auth.js';
import { getProfile, updateProfile, listUsers, deleteUser } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/me', authRequired, getProfile);
router.put('/me', authRequired, updateProfile);

// admin
router.get('/', authRequired, adminOnly, listUsers);
router.delete('/:id', authRequired, adminOnly, deleteUser);

export default router;
