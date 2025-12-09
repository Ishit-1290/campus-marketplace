// src/controllers/product.controller.js
import * as productService from "../services/product.service.js";
import multer from "multer";

const upload = multer({ dest: "uploads/" });

/* CREATE PRODUCT */
export async function createProduct(req, res, next) {
  try {
    const { title, description, category_id, seller_id } = req.body;
    const price = parseFloat(req.body.price);
    const quantity = parseInt(req.body.quantity) || 1;

    const product = await productService.createProduct({
      seller_id,
      title,
      description,
      price,
      quantity,
      category_id,
    });

    res.status(201).json({ success: true, product });
  } catch (err) {
    next(err);
  }
}

/* LIST PRODUCTS */
export async function listProducts(req, res, next) {
  try {
    let {
      page = 1,
      limit = 20,
      search = "",
      category_id,
      seller_id,
      onlyAvailable = "true",
    } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 20;
    category_id = category_id ? parseInt(category_id) : undefined;
    seller_id = seller_id ? parseInt(seller_id) : undefined;
    onlyAvailable = onlyAvailable !== "false";

    const rows = await productService.listProducts({
      page,
      limit,
      search,
      category_id,
      seller_id,
      onlyAvailable,
    });

    res.json({ success: true, products: rows });
  } catch (err) {
    next(err);
  }
}

/* GET PRODUCT DETAILS */
export async function getProduct(req, res, next) {
  try {
    const p = await productService.getProductById(req.params.id);
    if (!p)
      return res.status(404).json({ success: false, message: "Not found" });

    const imagesList = await productService.listProductImages(p.product_id);
    const mergedImages = imagesList.map((img) => img.image_url);

    const tags = await productService.listTagsForProduct(p.product_id);

    const product = {
      ...p,
      images: mergedImages,
      category_name: p.category_name,
      seller_name: p.seller_name,
      seller_email: p.seller_email,
      status: p.status,
      tags,
    };

    res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
}

/* UPDATE PRODUCT */
export async function updateProduct(req, res, next) {
  try {
    const ok = await productService.updateProduct(req.params.id, req.body);
    res.json({ success: true, updated: ok });
  } catch (err) {
    next(err);
  }
}

/* DELETE PRODUCT */
export async function deleteProduct(req, res, next) {
  try {
    const ok = await productService.deleteProduct(req.params.id);
    res.json({ success: true, deleted: ok });
  } catch (err) {
    next(err);
  }
}

/* IMAGE UPLOAD */
export const uploadImageMiddleware = upload.single("image");

export async function uploadProductImage(req, res, next) {
  try {
    if (!req.file)
      return res.status(400).json({ success: false, message: "No file" });

    const imageUrl = `/uploads/${req.file.filename}`;
    const rec = await productService.addProductImage(req.params.id, imageUrl);

    res.status(201).json({ success: true, image: rec });
  } catch (err) {
    next(err);
  }
}

/* TAGS */
export async function addTagToProduct(req, res, next) {
  try {
    const { tag_id } = req.body;
    await productService.addTagToProduct(req.params.id, tag_id);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

export async function removeTagFromProduct(req, res, next) {
  try {
    const { tag_id } = req.body;
    const ok = await productService.removeTagFromProduct(
      req.params.id,
      tag_id
    );
    res.json({ success: true, removed: ok });
  } catch (err) {
    next(err);
  }
}
