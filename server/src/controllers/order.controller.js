// src/controllers/order.controller.js
import * as orderService from '../services/order.service.js';

export async function createOrder(req, res, next) {
  try {
    // buyer id from auth
    const buyer_id = req.user.user_id;
    const { product_id, quantity } = req.body;
    const order = await orderService.createOrder({ buyer_id, product_id, quantity });
    res.status(201).json({ success: true, order });
  } catch (err) { next(err); }
}

export async function getOrder(req, res, next) {
  try {
    const ord = await orderService.getOrderById(req.params.id);
    if (!ord) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, order: ord });
  } catch (err) { next(err); }
}

export async function listOrders(req, res, next) {
  try {
    const { page, limit } = req.query;
    const rows = await orderService.listOrders({ page, limit, buyer_id: req.user.user_id });
    res.json({ success: true, orders: rows });
  } catch (err) { next(err); }
}

export async function updateOrderStatus(req, res, next) {
  try {
    const { status } = req.body;
    const ok = await orderService.updateOrderStatus(req.params.id, status);
    res.json({ success: true, updated: ok });
  } catch (err) { next(err); }
}
