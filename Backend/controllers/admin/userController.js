const User = require('../../models/User');
const Order = require('../../models/Order');
const Survey = require('../../models/Survey');

exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const skip = (page - 1) * limit;

    const query = search
      ? { $or: [{ name: new RegExp(search, 'i') }, { email: new RegExp(search, 'i') }] }
      : {};

    const users = await User.find(query)
      .select('name email verified createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

exports.updateUserVerification = async (req, res) => {
  try {
    const { userId } = req.params;
    const { verified } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { verified },
      { new: true, select: 'name email verified createdAt' }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user verification status', error: error.message });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId)
      .select('-password')
      .populate('solarRequests')
      .populate('orders');

      console.log(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user details', error: error.message });
  }
};
