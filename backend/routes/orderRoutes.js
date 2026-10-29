const express = require('express');
const router = express.Router();
const { requestPurchase, getIncomingRequests, getOutgoingRequests, acceptOrder, rejectOrder } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.post('/request', protect, requestPurchase);
router.get('/incoming', protect, getIncomingRequests);
router.get('/outgoing', protect, getOutgoingRequests);
router.put('/:id/accept', protect, acceptOrder);
router.put('/:id/reject', protect, rejectOrder);

module.exports = router;
