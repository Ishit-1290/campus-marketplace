// src/services/user.service.js
import pool from '../config/db.js';

export async function createUser({ name, email, password_hash, college_name = null, phone = null, profile_pic = null, role = 'buyer' }) {
  const sql = `INSERT INTO User (name, email, password_hash, college_name, phone, profile_pic, role) VALUES (?, ?, ?, ?, ?, ?, ?)`;
  const [res] = await pool.execute(sql, [name, email, password_hash, college_name, phone, profile_pic, role]);
  const id = res.insertId;
  const [rows] = await pool.execute(`SELECT user_id, name, email, college_name, phone, profile_pic, role, created_at, updated_at FROM User WHERE user_id = ?`, [id]);
  return rows[0];
}

export async function getUserByEmail(email) {
  const [rows] = await pool.execute(`SELECT * FROM User WHERE email = ?`, [email]);
  return rows[0] || null;
}

export async function getUserById(user_id) {
  const [rows] = await pool.execute(`SELECT user_id, name, email, college_name, phone, profile_pic, role, created_at, updated_at FROM User WHERE user_id = ?`, [user_id]);
  return rows[0] || null;
}

export async function listUsers({ page = 1, limit = 20, search } = {}) {
  const offset = (page -1)*limit;
  let base = `SELECT user_id, name, email, college_name, phone, profile_pic, role, created_at FROM User`;
  const params = [];
  if (search) { base += ` WHERE name LIKE ? OR email LIKE ?`; params.push(`%${search}%`, `%${search}%`); }
  base += ` ORDER BY user_id DESC LIMIT ? OFFSET ?`; params.push(Number(limit), Number(offset));
  const [rows] = await pool.execute(base, params);
  return rows;
}

export async function updateUser(user_id, { name, college_name, phone, profile_pic }) {
  const sql = `UPDATE User SET name = COALESCE(?, name), college_name = COALESCE(?, college_name), phone = COALESCE(?, phone), profile_pic = COALESCE(?, profile_pic) WHERE user_id = ?`;
  const [res] = await pool.execute(sql, [name, college_name, phone, profile_pic, user_id]);
  return res.affectedRows > 0;
}

export async function deleteUser(user_id) {
  const [res] = await pool.execute(`DELETE FROM User WHERE user_id = ?`, [user_id]);
  return res.affectedRows > 0;
}
