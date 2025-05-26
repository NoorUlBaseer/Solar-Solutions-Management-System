// Backend/controllers/admin/dashboardController.js
const User = require('../../models/User');
const Seller = require('../../models/Seller');
const Order = require('../../models/Order');
const Product = require('../../models/Product');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    //display on console
    console.log(totalUsers);
    const totalSellers = await Seller.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const pendingInstallations = await Order.countDocuments({ status: 'pending' });

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .populate('user', 'name')
      .populate('products.product', 'name');

    // Sample data for the sales chart (you may want to implement actual logic here)
    const salesData = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Sales',
        data: [30, 45, 57, 48, 65, 73],
      }]
    };

    res.json({
      stats: {
        totalUsers,
        totalSellers,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        pendingInstallations
      },
      recentOrders: recentOrders.map(order => ({
        id: order._id,
        customer: order.user.name,
        product: order.products[0].product.name,
        amount: order.totalAmount,
        status: order.status
      })),
      salesData
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard data', error: error.message });
  }
};