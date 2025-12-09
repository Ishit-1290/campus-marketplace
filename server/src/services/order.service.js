// src/services/order.service.js
import pool from '../config/db.js';

/*
Order table: Order(order_id, buyer_id, product_id, quantity, total_price, status, order_date, updated_at)
This schema stores one product per order row (as given). We'll support placing an order for one product at a time.
*/

export async function createOrder({ buyer_id, product_id, quantity }) {
  if (!quantity || quantity <= 0) throw { status: 400, message: 'Invalid quantity' };

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // lock the product row
    const [pRows] = await conn.execute(`SELECT product_id, price, quantity AS stock, status FROM Product WHERE product_id = ? FOR UPDATE`, [product_id]);
    const product = pRows[0];
    if (!product) throw { status: 404, message: 'Product not found' };
    if (product.status !== 'available') throw { status: 400, message: 'Product not available' };
    if (product.stock < quantity) throw { status: 400, message: 'Insufficient stock' };

    const total_price = Number(product.price) * Number(quantity);

    // insert order
    const [orderRes] = await conn.execute(`INSERT INTO \`Order\` (buyer_id, product_id, quantity, total_price, status) VALUES (?, ?, ?, ?, 'pending')`, [buyer_id, product_id, quantity, total_price]);
    const orderId = orderRes.insertId;

    // decrement product stock
    await conn.execute(`UPDATE Product SET quantity = quantity - ? WHERE product_id = ?`, [quantity, product_id]);

    await conn.commit();
    return { order_id: orderId, buyer_id, product_id, quantity, total_price };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

export async function getOrderById(order_id) {
  const [rows] = await pool.execute(`SELECT o.*, u.name AS buyer_name, p.title AS product_title FROM \`Order\` o JOIN User u ON o.buyer_id = u.user_id JOIN Product p ON o.product_id = p.product_id WHERE o.order_id = ?`, [order_id]);
  return rows[0] || null;
}

export async function listOrders({ page = 1, limit = 20, buyer_id } = {}) {
  const offset = (page-1)*limit;
  let sql = `SELECT o.*, u.name AS buyer_name, p.title AS product_title FROM \`Order\` o JOIN User u ON o.buyer_id = u.user_id JOIN Product p ON o.product_id = p.product_id`;
  const params = [];
  if (buyer_id) { sql += ` WHERE o.buyer_id = ?`; params.push(buyer_id); }
  sql += ` ORDER BY o.order_date DESC LIMIT ? OFFSET ?`;
  params.push(Number(limit), Number(offset));
  const [rows] = await pool.execute(sql, params);
  return rows;
}

export async function updateOrderStatus(order_id, status) {
  const [res] = await pool.execute(`UPDATE \`Order\` SET status = ? WHERE order_id = ?`, [status, order_id]);
  return res.affectedRows > 0;
}
