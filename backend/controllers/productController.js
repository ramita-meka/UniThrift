const db = require('../config/db');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { university, category } = req.query;
    let query = `
        SELECT P.*, C.CategoryName, U.Name as SellerName 
        FROM Products P
        JOIN Categories C ON P.CategoryID = C.CategoryID
        JOIN Users U ON P.UserID = U.UserID
        WHERE 1=1
    `;
    let queryParams = [];

    if (university) {
        query += ` AND P.University = ?`;
        queryParams.push(university);
    }
    
    if (category) {
        query += ` AND C.CategoryName = ?`;
        queryParams.push(category);
    }
    
    query += ` ORDER BY P.CreatedAt DESC`;

    const [products] = await db.execute(query, queryParams);
    
    // Map db results to mimic what frontend expects
    const formattedProducts = products.map(p => ({
        _id: p.ProductID,
        name: p.Title,
        price: Number(p.Price),
        condition: p.ItemCondition,
        category: p.CategoryName,
        university: p.University,
        seller: p.SellerName,
        status: p.Status,
        description: p.Description,
        imageUrls: p.ImageUrls ? JSON.parse(p.ImageUrls) : []
    }));

    res.json(formattedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const [products] = await db.execute(`
        SELECT P.*, C.CategoryName, U.Name as SellerName 
        FROM Products P
        JOIN Categories C ON P.CategoryID = C.CategoryID
        JOIN Users U ON P.UserID = U.UserID
        WHERE P.ProductID = ?
    `, [req.params.id]);

    if (products.length > 0) {
        const p = products[0];
        res.json({
            _id: p.ProductID,
            name: p.Title,
            price: Number(p.Price),
            condition: p.ItemCondition,
            category: p.CategoryName,
            university: p.University,
            seller: p.SellerName,
            status: p.Status,
            description: p.Description,
            imageUrls: p.ImageUrls ? JSON.parse(p.ImageUrls) : []
        });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private
const createProduct = async (req, res) => {
  const { title, price, itemCondition, category, description } = req.body;

  try {
    if (!title || !price || !itemCondition || !category) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Get CategoryID
    const [categories] = await db.execute('SELECT CategoryID FROM Categories WHERE CategoryName = ?', [category]);
    if (categories.length === 0) {
      return res.status(400).json({ message: 'Invalid category' });
    }
    const categoryId = categories[0].CategoryID;

    const imageUrls = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];

    // Insert Product
    const query = `
      INSERT INTO Products (UserID, CategoryID, Title, Price, ItemCondition, University, Description, ImageUrls)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(query, [
      req.user.UserID,
      categoryId,
      title,
      price,
      itemCondition,
      req.user.University,
      description || '',
      JSON.stringify(imageUrls)
    ]);

    res.status(201).json({ message: 'Product created successfully', productId: result.insertId });

  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Server Error while creating product' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct
};
