const db = require('../config/db');

// @desc    Create a purchase request (Pending order)
// @route   POST /api/orders/request
// @access  Private (Buyer)
const requestPurchase = async (req, res) => {
    try {
        const { productId } = req.body;
        const buyerId = req.user.UserID;

        const [products] = await db.execute(`SELECT UserID, Status FROM Products WHERE ProductID = ?`, [productId]);
        if (products.length === 0) return res.status(404).json({ message: 'Product not found' });
        
        const product = products[0];
        if (product.Status === 'Sold') return res.status(400).json({ message: 'Product is already sold' });
        if (product.UserID === buyerId) return res.status(400).json({ message: 'Cannot buy your own product' });

        const [existingOrders] = await db.execute(
            `SELECT * FROM Orders WHERE ProductID = ? AND BuyerID = ? AND OrderStatus = 'Pending'`,
            [productId, buyerId]
        );
        if (existingOrders.length > 0) {
            return res.status(400).json({ message: 'You have already requested to purchase this item' });
        }

        await db.execute(
            `INSERT INTO Orders (ProductID, BuyerID, SellerID, OrderStatus) VALUES (?, ?, ?, 'Pending')`,
            [productId, buyerId, product.UserID]
        );

        res.status(201).json({ message: 'Purchase request sent successfully' });
    } catch (error) {
        console.error("Order request error:", error);
        res.status(500).json({ message: 'Server error creating order request' });
    }
};

// @desc    Get incoming requests for seller
// @route   GET /api/orders/incoming
// @access  Private (Seller/Both)
const getIncomingRequests = async (req, res) => {
    try {
        const sellerId = req.user.UserID;
        
        const query = `
            SELECT O.OrderID, O.ProductID, O.OrderStatus, O.OrderDate,
                   P.Title, P.Price, P.ImageUrls,
                   U.Name as BuyerName, U.Email as BuyerEmail, U.University as BuyerUniversity
            FROM Orders O
            JOIN Products P ON O.ProductID = P.ProductID
            JOIN Users U ON O.BuyerID = U.UserID
            WHERE O.SellerID = ? AND O.OrderStatus = 'Pending'
            ORDER BY O.OrderDate DESC
        `;
        
        const [requests] = await db.execute(query, [sellerId]);
        
        const parsedRequests = requests.map(req => ({
            ...req,
            ImageUrls: req.ImageUrls ? JSON.parse(req.ImageUrls) : []
        }));

        res.json(parsedRequests);
    } catch (error) {
        console.error("Fetch incoming error:", error);
        res.status(500).json({ message: 'Server error fetching requests' });
    }
};

// @desc    Get outgoing requests for buyer
// @route   GET /api/orders/outgoing
// @access  Private (Buyer/Both)
const getOutgoingRequests = async (req, res) => {
    try {
        const buyerId = req.user.UserID;
        
        const query = `
            SELECT O.OrderID, O.ProductID, O.OrderStatus, O.OrderDate,
                   P.Title, P.Price, P.ImageUrls,
                   U.Name as SellerName, U.University as SellerUniversity
            FROM Orders O
            JOIN Products P ON O.ProductID = P.ProductID
            JOIN Users U ON O.SellerID = U.UserID
            WHERE O.BuyerID = ?
            ORDER BY O.OrderDate DESC
        `;
        
        const [requests] = await db.execute(query, [buyerId]);
        
        const parsedRequests = requests.map(req => ({
            ...req,
            ImageUrls: req.ImageUrls ? JSON.parse(req.ImageUrls) : []
        }));

        res.json(parsedRequests);
    } catch (error) {
        console.error("Fetch outgoing error:", error);
        res.status(500).json({ message: 'Server error fetching outgoing requests' });
    }
};

// @desc    Accept order request
// @route   PUT /api/orders/:id/accept
// @access  Private (Seller)
const acceptOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const sellerId = req.user.UserID;

        const [orders] = await db.execute(`SELECT * FROM Orders WHERE OrderID = ? AND SellerID = ?`, [orderId, sellerId]);
        if (orders.length === 0) return res.status(404).json({ message: 'Order request not found or unauthorized' });

        const order = orders[0];
        if (order.OrderStatus !== 'Pending') return res.status(400).json({ message: `Order is already ${order.OrderStatus}` });

        const productId = order.ProductID;
        
        // The MySQL Trigger 'After_Order_Completed' handles product status changes, 
        // cart deletions, and wishlist deletions via SQL Triggers perfectly!
        await db.execute(`UPDATE Orders SET OrderStatus = 'Completed' WHERE OrderID = ?`, [orderId]);
        
        // MySQL explicitly prevents Triggers from recursively editing the table they fired upon (Error 1442).
        // Therefore, we must manually resolve the competing conflicting Orders sequentially here in Node:
        await db.execute(`UPDATE Orders SET OrderStatus = 'Cancelled' WHERE ProductID = ? AND OrderStatus = 'Pending'`, [productId]);

        res.json({ message: 'Order accepted successfully. Product automatically marked as sold by SQL triggers.' });
    } catch (error) {
        console.error("Accept order error:", error);
        res.status(500).json({ message: 'Server error accepting order' });
    }
};

// @desc    Reject order request
// @route   PUT /api/orders/:id/reject
// @access  Private (Seller)
const rejectOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        const sellerId = req.user.UserID;

        const [orders] = await db.execute(`SELECT * FROM Orders WHERE OrderID = ? AND SellerID = ?`, [orderId, sellerId]);
        if (orders.length === 0) return res.status(404).json({ message: 'Order request not found or unauthorized' });
        
        if (orders[0].OrderStatus !== 'Pending') return res.status(400).json({ message: 'Can only reject Pending requests' });

        await db.execute(`UPDATE Orders SET OrderStatus = 'Cancelled' WHERE OrderID = ?`, [orderId]);

        res.json({ message: 'Order rejected successfully' });
    } catch (error) {
        console.error("Reject order error:", error);
        res.status(500).json({ message: 'Server error rejecting order' });
    }
};

module.exports = { requestPurchase, getIncomingRequests, getOutgoingRequests, acceptOrder, rejectOrder };
