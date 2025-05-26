const Admin = require('../../models/Admin');
const Product = require('../../models/Product');

exports.getAdminProfile = async (req, res) => {
  try {
    const adminId = req.admin.id; // Assuming you have authentication middleware
    const admin = await Admin.findById(adminId).select('name email');
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admin profile', error: error.message });
  }
};

exports.getDiscounts = async (req, res) => {
  try {
    const discounts = await Admin.findOne().select('discounts warrantyDiscount');
    res.json(discounts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching discounts', error: error.message });
  }
};

exports.updateDiscounts = async (req, res) => {
  try {
    const { discounts, warrantyDiscount } = req.body;
    await Admin.findOneAndUpdate({}, { discounts, warrantyDiscount });
    
    // Apply discounts to all products
    await applyDiscountsToProducts(discounts, warrantyDiscount);

    res.json({ message: 'Discounts updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating discounts', error: error.message });
  }
};

async function applyDiscountsToProducts(discounts, warrantyDiscount) {
  const products = await Product.find();

  for (let product of products) {
    let discountPercentage = 0;

    // Apply price range discount
    for (let discount of discounts) {
      const [min, max] = discount.range.split('-').map(Number);
      if (product.price >= min && (max === undefined || product.price <= max)) {
        discountPercentage = Math.max(discountPercentage, discount.discount);
        break;
      }
    }

    // Apply warranty discount if applicable
    if (product.warranty) {
      discountPercentage = Math.max(discountPercentage, warrantyDiscount);
    }

    // Calculate discounted price
    const discountAmount = (product.price * discountPercentage) / 100;
    product.discountedPrice = product.price - discountAmount;

    await product.save();
  }
}

