// src/middleware/validate.js
import { validationResult } from 'express-validator';

export function validate(req, res, next) {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    console.log('No validation');
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
}
