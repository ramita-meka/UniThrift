const express = require('express');
const router = express.Router();
const { 
    getCart, addToCart, removeFromCart,
    getWishlist, addToWishlist, removeFromWishlist,
    getProfile
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.route('/cart').get(protect, getCart).post(protect, addToCart);
router.route('/cart/:id').delete(protect, removeFromCart);

router.route('/wishlist').get(protect, getWishlist).post(protect, addToWishlist);
router.route('/wishlist/:id').delete(protect, removeFromWishlist);

router.route('/profile').get(protect, getProfile);

module.exports = router;
