const db = require('../config/db');

// ---------- CART ----------

const getCart = async (req, res) => {
    try {
        const query = `
            SELECT P.*, C.CategoryName, U.Name as SellerName, CI.CartItemID 
            FROM CartItems CI
            JOIN Products P ON CI.ProductID = P.ProductID
            JOIN Categories C ON P.CategoryID = C.CategoryID
            JOIN Users U ON P.UserID = U.UserID
            WHERE CI.UserID = ?
            ORDER BY CI.AddedAt DESC
        `;
        const [items] = await db.execute(query, [req.user.UserID]);
        
        const formattedItems = items.map(p => ({
            _id: p.ProductID,
            cartItemId: p.CartItemID,
            name: p.Title,
            price: Number(p.Price),
            condition: p.ItemCondition,
            category: p.CategoryName,
            university: p.University,
            seller: p.SellerName,
            imageUrls: p.ImageUrls ? JSON.parse(p.ImageUrls) : []
        }));
        res.json(formattedItems);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const addToCart = async (req, res) => {
    try {
        const { productId } = req.body;
        if (!productId) return res.status(400).json({ message: 'Product ID required' });
        await db.execute('INSERT IGNORE INTO CartItems (UserID, ProductID) VALUES (?, ?)', [req.user.UserID, productId]);
        res.status(201).json({ message: 'Added to cart' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const removeFromCart = async (req, res) => {
    try {
        await db.execute('DELETE FROM CartItems WHERE UserID = ? AND ProductID = ?', [req.user.UserID, req.params.id]);
        res.json({ message: 'Removed from cart' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// ---------- WISHLIST ----------

const getWishlist = async (req, res) => {
    try {
        const query = `
            SELECT P.*, C.CategoryName, U.Name as SellerName, WI.WishlistItemID 
            FROM WishlistItems WI
            JOIN Products P ON WI.ProductID = P.ProductID
            JOIN Categories C ON P.CategoryID = C.CategoryID
            JOIN Users U ON P.UserID = U.UserID
            WHERE WI.UserID = ?
            ORDER BY WI.AddedAt DESC
        `;
        const [items] = await db.execute(query, [req.user.UserID]);
        
        const formattedItems = items.map(p => ({
            _id: p.ProductID,
            wishlistItemId: p.WishlistItemID,
            name: p.Title,
            price: Number(p.Price),
            condition: p.ItemCondition,
            category: p.CategoryName,
            university: p.University,
            seller: p.SellerName,
            imageUrls: p.ImageUrls ? JSON.parse(p.ImageUrls) : []
        }));
        res.json(formattedItems);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;
        if (!productId) return res.status(400).json({ message: 'Product ID required' });
        await db.execute('INSERT IGNORE INTO WishlistItems (UserID, ProductID) VALUES (?, ?)', [req.user.UserID, productId]);
        res.status(201).json({ message: 'Added to wishlist' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const removeFromWishlist = async (req, res) => {
    try {
        await db.execute('DELETE FROM WishlistItems WHERE UserID = ? AND ProductID = ?', [req.user.UserID, req.params.id]);
        res.json({ message: 'Removed from wishlist' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// ---------- PROFILE ----------

const getProfile = async (req, res) => {
    try {
        const [users] = await db.execute('SELECT UserID, Name, RegNumber, Email, Phone, Department, University, Role, CreatedAt FROM Users WHERE UserID = ?', [req.user.UserID]);
        if(users.length === 0) return res.status(404).json({ message: 'User not found' });
        
        const [listings] = await db.execute(`
            SELECT P.*, C.CategoryName, U.Name as SellerName 
            FROM Products P
            JOIN Categories C ON P.CategoryID = C.CategoryID
            JOIN Users U ON P.UserID = U.UserID
            WHERE P.UserID = ?
            ORDER BY P.CreatedAt DESC
        `, [req.user.UserID]);
        
        const formattedListings = listings.map(p => ({
            _id: p.ProductID,
            name: p.Title,
            price: Number(p.Price),
            condition: p.ItemCondition,
            category: p.CategoryName,
            university: p.University,
            seller: p.SellerName,
            status: p.Status,
            imageUrls: p.ImageUrls ? JSON.parse(p.ImageUrls) : []
        }));
        
        res.json({ profile: users[0], listings: formattedListings });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getCart, addToCart, removeFromCart,
    getWishlist, addToWishlist, removeFromWishlist,
    getProfile
};
