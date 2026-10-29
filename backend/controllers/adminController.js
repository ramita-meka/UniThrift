const db = require('../config/db');

// @desc    Get all users systematically
// @route   GET /api/admin/users
// @access  Private (Admin Only)
const getAllUsers = async (req, res) => {
    try {
        const query = `
            SELECT UserID, Name, RegNumber, Email, Phone, Department, University, Role, CreatedAt
            FROM Users
            ORDER BY CreatedAt DESC
        `;
        const [users] = await db.execute(query);
        
        // Grab global products explicitly
        const [products] = await db.execute(`
            SELECT P.ProductID, P.Title, P.Price, P.ItemCondition, P.Status, P.University, C.CategoryName, U.Name as SellerName
            FROM Products P
            JOIN Categories C ON P.CategoryID = C.CategoryID
            JOIN Users U ON P.UserID = U.UserID
            ORDER BY P.CreatedAt DESC
        `);

        // Grab metrics dynamically alongside
        const [[stats]] = await db.execute(`
            SELECT 
                (SELECT COUNT(*) FROM Users) as totalUsers,
                (SELECT COUNT(*) FROM Products) as totalProducts,
                (SELECT COUNT(*) FROM Orders) as totalOrders
        `);

        res.json({
            users,
            products,
            stats
        });
    } catch (error) {
        console.error("Admin fetch users error:", error);
        res.status(500).json({ message: 'Server error parsing global users' });
    }
};

// @desc    Delete user systemically
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin Only)
const deleteUser = async (req, res) => {
    try {
        // Natively cascade will handle their products/orders/carts dynamically based on schema constraints
        await db.execute('DELETE FROM Users WHERE UserID = ?', [req.params.id]);
        res.json({ message: 'User forcefully expunged locally.' });
    } catch (error) {
        console.error("Admin delete user error:", error);
        res.status(500).json({ message: 'Server error deleting generic user' });
    }
};

module.exports = { getAllUsers, deleteUser };
