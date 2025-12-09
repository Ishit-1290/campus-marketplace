// src/services/product.service.js
import pool from "../config/db.js";

/* ================================
   CREATE PRODUCT
================================ */
export async function createProduct({
  seller_id,
  title,
  description = null,
  price = 0.0,
  quantity = 1,
  category_id,
}) {
  const sql = `
    INSERT INTO Product 
    (seller_id, title, description, price, quantity, category_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const [res] = await pool.execute(sql, [
    seller_id,
    title,
    description,
    price,
    quantity,
    category_id,
  ]);

  const id = res.insertId;
  const [rows] = await pool.execute(
    `SELECT * FROM Product WHERE product_id = ?`,
    [id]
  );

  return rows[0];
}

/* ================================
   LIST PRODUCTS (WITH CATEGORY, IMAGES, SELLER INFO)
================================ */
export async function listProducts({
  page = 1,
  limit = 20,
  search,
  category_id,
  seller_id,
  onlyAvailable = true,
} = {}) {
  const pageNum = Number(page) || 1;
  const limitNum = Number(limit) || 20;
  const offset = (pageNum - 1) * limitNum;

  const conditions = [];
  const params = [];

  if (onlyAvailable) conditions.push(`p.status = 'available'`);

  if (search) {
    conditions.push(`(p.title LIKE ? OR p.description LIKE ?)`);
    params.push(`%${search}%`, `%${search}%`);
  }

  if (category_id) {
    conditions.push(`p.category_id = ?`);
    params.push(category_id);
  }

  if (seller_id) {
    conditions.push(`p.seller_id = ?`);
    params.push(seller_id);
  }

  let sql = `
    SELECT 
      p.*,
      p.status,
      GROUP_CONCAT(pi.image_url) AS images,
      c.name AS category_name,
      u.name AS seller_name,
      u.email AS seller_email
    FROM Product p
    LEFT JOIN ProductImage pi ON p.product_id = pi.product_id
    LEFT JOIN Category c ON p.category_id = c.category_id
    LEFT JOIN User u ON p.seller_id = u.user_id
  `;

  if (conditions.length) sql += " WHERE " + conditions.join(" AND ");

  sql += `
    GROUP BY p.product_id
    ORDER BY p.created_at DESC
    LIMIT ${limitNum} OFFSET ${offset}
  `;

  const [rows] = await pool.execute(sql, params);

  return rows.map((p) => ({
    ...p,
    images: p.images ? p.images.split(",") : [],
  }));
}

/* ================================
   GET PRODUCT BY ID
================================ */
export async function getProductById(product_id) {
  const sql = `
    SELECT 
      p.*,
      p.status,
      GROUP_CONCAT(pi.image_url) AS images,
      c.name AS category_name,
      u.name AS seller_name,
      u.email AS seller_email
    FROM Product p
    LEFT JOIN ProductImage pi ON p.product_id = pi.product_id
    LEFT JOIN Category c ON p.category_id = c.category_id
    LEFT JOIN User u ON p.seller_id = u.user_id
    WHERE p.product_id = ?
    GROUP BY p.product_id
  `;

  const [rows] = await pool.execute(sql, [product_id]);

  if (!rows[0]) return null;

  return {
    ...rows[0],
    images: rows[0].images ? rows[0].images.split(",") : [],
  };
}

/* ================================
   UPDATE PRODUCT
================================ */
export async function updateProduct(
  product_id,
  { title, description, price, quantity, category_id, status }
) {
  const sql = `
    UPDATE Product 
    SET 
      title = COALESCE(?, title),
      description = COALESCE(?, description),
      price = COALESCE(?, price),
      quantity = COALESCE(?, quantity),
      category_id = COALESCE(?, category_id),
      status = COALESCE(?, status)
    WHERE product_id = ?
  `;

  const [res] = await pool.execute(sql, [
    title,
    description,
    price,
    quantity,
    category_id,
    status,
    product_id,
  ]);

  return res.affectedRows > 0;
}

/* ================================
   DELETE PRODUCT
================================ */
export async function deleteProduct(product_id) {
  const [res] = await pool.execute(
    `DELETE FROM Product WHERE product_id = ?`,
    [product_id]
  );
  return res.affectedRows > 0;
}

/* ================================
   IMAGES
================================ */
export async function addProductImage(product_id, image_url) {
  const [res] = await pool.execute(
    `INSERT INTO ProductImage (product_id, image_url) VALUES (?, ?)`,
    [product_id, image_url]
  );
  return { image_id: res.insertId, product_id, image_url };
}

export async function listProductImages(product_id) {
  const [rows] = await pool.execute(
    `SELECT * FROM ProductImage WHERE product_id = ? ORDER BY uploaded_at`,
    [product_id]
  );
  return rows;
}

/* ================================
   TAGS
================================ */
export async function addTagToProduct(product_id, tag_id) {
  await pool.execute(
    `INSERT IGNORE INTO ProductTag (product_id, tag_id) VALUES (?, ?)`,
    [product_id, tag_id]
  );
  return true;
}

export async function removeTagFromProduct(product_id, tag_id) {
  const [res] = await pool.execute(
    `DELETE FROM ProductTag WHERE product_id = ? AND tag_id = ?`,
    [product_id, tag_id]
  );
  return res.affectedRows > 0;
}

export async function listTagsForProduct(product_id) {
  const [rows] = await pool.execute(
    `
    SELECT t.* 
    FROM Tag t 
    JOIN ProductTag pt ON t.tag_id = pt.tag_id 
    WHERE pt.product_id = ?
  `,
    [product_id]
  );
  return rows;
}
