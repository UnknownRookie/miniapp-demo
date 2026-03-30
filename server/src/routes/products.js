const express = require('express');
const authMiddleware = require('../middleware/auth');
const asyncHandler = require('../utils/async-handler');
const HttpError = require('../utils/http-error');
const pool = require('../config/db');

const router = express.Router();

router.get(
  '/:id',
  authMiddleware,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const [rows] = await pool.query(
      'SELECT id, title, description, price, cover_url, status FROM products WHERE id = ? LIMIT 1',
      [id]
    );

    const product = rows[0];
    if (!product || product.status !== 'published') {
      throw new HttpError(404, 'Product not found');
    }

    res.json({
      code: 0,
      message: 'ok',
      data: {
        id: product.id,
        title: product.title,
        description: product.description,
        price: Number(product.price),
        coverUrl: product.cover_url
      }
    });
  })
);

module.exports = router;
