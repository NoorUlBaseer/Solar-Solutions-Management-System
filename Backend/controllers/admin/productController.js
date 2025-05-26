const Product = require('../../models/Product');

exports.getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const skip = (page - 1) * limit;

    const query = search
      ? { name: new RegExp(search, 'i') }
      : {};

    const products = await Product.find(query)
      .select('name price stock warranty verified createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Product.countDocuments(query);

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

exports.getProductDetails = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId).populate('seller', 'name');

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product details', error: error.message });
  }
};

exports.updateProductVerification = async (req, res) => {
  try {
    const { productId } = req.params;
    const { verified } = req.body;

    const product = await Product.findByIdAndUpdate(
      productId,
      { verified },
      { new: true, select: 'name price stock warranty verified createdAt' }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product verification status', error: error.message });
  }
};

