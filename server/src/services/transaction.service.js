// src/services/transaction.service.js
import pool from '../config/db.js';

export async function createTransaction({ order_id, amount, payment_method, transaction_status = 'pending' }) {
  const [res] = await pool.execute(`INSERT INTO \`Transaction\` (order_id, amount, payment_method, transaction_status) VALUES (?, ?, ?, ?)`, [order_id, amount, payment_method, transaction_status]);
  return { transaction_id: res.insertId, order_id, amount, payment_method, transaction_status };
}

export async function getTransactionByOrderId(order_id) {
  const [rows] = await pool.execute(`SELECT * FROM \`Transaction\` WHERE order_id = ?`, [order_id]);
  return rows[0] || null;
}

export async function updateTransactionStatus(transaction_id, status) {
  const [res] = await pool.execute(`UPDATE \`Transaction\` SET transaction_status = ? WHERE transaction_id = ?`, [status, transaction_id]);
  return res.affectedRows > 0;
}
