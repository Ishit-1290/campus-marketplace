// src/controllers/transaction.controller.js
import * as transactionService from '../services/transaction.service.js';
import * as orderService from '../services/order.service.js';

export async function createTransaction(req, res, next) {
  try {
    const { order_id, amount, payment_method } = req.body;
    // simple flow: create transaction record and mark order confirmed on success (simulate)
    const tx = await transactionService.createTransaction({ order_id, amount, payment_method, transaction_status: 'success' });
    // update order status to confirmed
    await orderService.updateOrderStatus(order_id, 'confirmed');
    res.status(201).json({ success: true, transaction: tx });
  } catch (err) { next(err); }
}

export async function getTransaction(req, res, next) {
  try {
    const tx = await transactionService.getTransactionByOrderId(req.params.order_id);
    if (!tx) return res.status(404).json({ success: false, message: 'Not found' });
    res.json({ success: true, transaction: tx });
  } catch (err) { next(err); }
}
