const User = require('../../models/User');
const Seller = require('../../models/Seller');
const Order = require('../../models/Order');
const Product = require('../../models/Product');

exports.getAnalyticsData = async (req, res) => {
  try {
    // Get monthly user and seller growth
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);

    const monthlyGrowth = await Promise.all([
      User.aggregate([
        { $match: { createdAt: { $gte: sixMonthsAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),
      Seller.aggregate([
        { $match: { createdAt: { $gte: sixMonthsAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ])
    ]);

    const lineChartData = monthlyGrowth[0].map((userMonth, index) => ({
      month: new Date(userMonth._id).toLocaleString('default', { month: 'short' }),
      users: userMonth.count,
      sellers: monthlyGrowth[1][index] ? monthlyGrowth[1][index].count : 0
    }));

    // Get sales by category
    const salesByCategory = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          sales: { $sum: "$salesCount" }
        }
      },
      { $sort: { sales: -1 } },
      { $limit: 4 }
    ]);

    const barChartData = salesByCategory.map(category => ({
      name: category._id,
      sales: category.sales
    }));

    // Get order status breakdown
    const orderStatusBreakdown = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          value: { $sum: 1 }
        }
      }
    ]);

    const pieChartData = orderStatusBreakdown.map(status => ({
      name: status._id,
      value: status.value
    }));

    res.json({
      lineChartData,
      barChartData,
      pieChartData
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching analytics data', error: error.message });
  }
};

