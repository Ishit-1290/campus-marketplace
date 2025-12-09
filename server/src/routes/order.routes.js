// src/routes/order.routes.js
import express from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { authRequired } from '../middleware/auth.js';
import { createOrder, getOrder, listOrders, updateOrderStatus } from '../controllers/order.controller.js';

const router = express.Router();

router.get('/', authRequired, listOrders);
router.get('/:id', authRequired, getOrder);
router.post('/', authRequired, [ body('product_id').isInt({ min: 1 }), body('quantity').isInt({ min: 1 }) ], validate, createOrder);

// update status (seller/admin)
router.put('/:id/status', authRequired, updateOrderStatus);

export default router;
