// src/services/category.service.js
import pool from '../config/db.js';

export async function createCategory({ name, description }) {
  const [res] = await pool.execute(`INSERT INTO Category (name, description) VALUES (?, ?)`, [name, description]);
  const id = res.insertId;
  const [rows] = await pool.execute(`SELECT * FROM Category WHERE category_id = ?`, [id]);
  return rows[0];
}

export async function listCategories() {
  const [rows] = await pool.execute(`SELECT * FROM Category ORDER BY 1 ASC`);
  return rows;
}

export async function getCategoryById(id) {
  const [rows] = await pool.execute(`SELECT * FROM Category WHERE category_id = ?`, [id]);
  return rows[0] || null;
}

export async function updateCategory(id, { name, description }) {
  const [res] = await pool.execute(`UPDATE Category SET name = COALESCE(?, name), description = COALESCE(?, description) WHERE category_id = ?`, [name, description, id]);
  return res.affectedRows > 0;
}

export async function deleteCategory(id) {
  const [res] = await pool.execute(`DELETE FROM Category WHERE category_id = ?`, [id]);
  return res.affectedRows > 0;
}
