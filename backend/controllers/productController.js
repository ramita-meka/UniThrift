// @desc    Fetch all products (Mocked)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  const products = [
    { _id: '1', name: 'Calculus Textbook', price: 25.00, condition: 'Used - Good', category: 'Books' },
    { _id: '2', name: 'Ergonomic Chair', price: 45.00, condition: 'Like New', category: 'Furniture' },
    { _id: '3', name: 'Noise Cancelling Headphones', price: 80.00, condition: 'Used - Fair', category: 'Electronics' },
  ];
  
  res.json(products);
};

// @desc    Fetch single product (Mocked)
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  const product = { _id: req.params.id, name: 'Sample Product', price: 20.00, description: 'A great item for a student' };
  
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

module.exports = {
  getProducts,
  getProductById
};
