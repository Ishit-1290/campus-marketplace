// src/routes/product.routes.js
import express from 'express';
import { body } from 'express-validator';
import { validate } from '../middleware/validate.js';
import { authRequired } from '../middleware/auth.js';
import {
  createProduct, listProducts, getProduct, updateProduct, deleteProduct,
  uploadImageMiddleware, uploadProductImage, addTagToProduct, removeTagFromProduct
} from '../controllers/product.controller.js';

const router = express.Router();

router.get('/', listProducts);
router.get('/:id', getProduct);

router.post('/', authRequired, [
  body('title').notEmpty(), body('price').isFloat({ min: 0 }), body('quantity').isInt({ min: 0 }), body('category_id').isInt({ min: 1 })
], validate, createProduct);

router.put('/:id', authRequired, updateProduct);
router.delete('/:id', authRequired, deleteProduct);

// images
router.post('/:id/images', authRequired, uploadImageMiddleware, uploadProductImage);

// tags
router.post('/:id/tags', authRequired, addTagToProduct);
router.delete('/:id/tags', authRequired, removeTagFromProduct);

export default router;
