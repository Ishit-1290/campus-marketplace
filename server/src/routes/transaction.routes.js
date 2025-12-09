// src/routes/transaction.routes.js
import express from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { authRequired } from '../middleware/auth.js';
import { createTransaction, getTransaction } from '../controllers/transaction.controller.js';

const router = express.Router();

router.post('/', authRequired, [ body('order_id').isInt({ min: 1 }), body('amount').isFloat({ min: 0 }), body('payment_method').isIn(['UPI','Card','Cash']) ], validate, createTransaction);
router.get('/order/:order_id', authRequired, getTransaction);

export default router;
