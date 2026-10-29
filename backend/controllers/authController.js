const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id, university, role) => {
    return jwt.sign({ id, university, role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, regNumber, email, phone, password, department, university, role } = req.body;

    try {
        // Run validations
        if (!name || !regNumber || !email || !password || !university) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // Check if user already exists
        const [existingUsers] = await db.execute(
            'SELECT * FROM Users WHERE Email = ? OR RegNumber = ?', 
            [email, regNumber]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'User with this email or reg number already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Insert new user
        const query = `
            INSERT INTO Users (Name, RegNumber, Email, Phone, Password, Department, University, Role)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.execute(query, [
            name, regNumber, email, phone, passwordHash, department, university, role || 'Buyer'
        ]);

        const newUser = {
            id: result.insertId,
            name,
            email,
            university,
            role: role || 'Buyer'
        };

        res.status(201).json({
            user: newUser,
            token: generateToken(newUser.id, newUser.university, newUser.role)
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration', error: error.message, sqlMessage: error.sqlMessage });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user
        const [users] = await db.execute('SELECT * FROM Users WHERE Email = ?', [email]);
        
        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = users[0];

        // Check password
        const isMatch = await bcrypt.compare(password, user.Password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        res.json({
            user: {
                id: user.UserID,
                name: user.Name,
                email: user.Email,
                university: user.University,
                role: user.Role
            },
            token: generateToken(user.UserID, user.University, user.Role)
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

module.exports = {
    registerUser,
    loginUser
};
