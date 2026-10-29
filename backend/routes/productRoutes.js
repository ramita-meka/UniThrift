const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct } = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// GET & POST /api/products
router.route('/').get(getProducts).post(protect, upload.array('images', 5), createProduct);

// GET /api/products/:id
router.route('/:id').get(getProductById);

module.exports = router;
