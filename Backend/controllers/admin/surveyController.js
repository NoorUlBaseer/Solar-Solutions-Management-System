const User = require('../../models/User');
const Survey = require('../../models/Survey');

exports.getUsers = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user details', error: error.message });
  }
};

exports.scheduleSurvey = async (req, res) => {
  try {
    const { userId, surveyorId, scheduledDate, notes } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const survey = new Survey({
      user: userId,
      type: 'house',
      surveyDate: scheduledDate,
      surveyor: surveyorId,
      status: 'requested',
      Notes: notes,
    });

    await survey.save();

    user.solarRequests.push(survey._id);
    await user.save();

    res.json({ message: 'Survey scheduled successfully', survey });
  } catch (error) {
    res.status(500).json({ message: 'Error scheduling survey', error: error.message });
  }
};

