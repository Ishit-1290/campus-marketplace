// src/services/tag.service.js
import pool from '../config/db.js';

export async function createTag(name) {
  const [res] = await pool.execute(`INSERT INTO Tag (name) VALUES (?)`, [name]);
  return { tag_id: res.insertId, name };
}

export async function listTags() {
  const [rows] = await pool.execute(`SELECT * FROM Tag ORDER BY name`);
  return rows;
}

export async function getTagById(id) {
  const [rows] = await pool.execute(`SELECT * FROM Tag WHERE tag_id = ?`, [id]);
  return rows[0] || null;
}

export async function deleteTag(id) {
  const [res] = await pool.execute(`DELETE FROM Tag WHERE tag_id = ?`, [id]);
  return res.affectedRows > 0;
}
