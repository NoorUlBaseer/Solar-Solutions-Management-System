const Seller = require('../../models/Seller');
const Survey = require('../../models/Survey');

exports.getSellers = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const sellers = await Seller.find(query).select('-password');
    res.json(sellers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sellers', error: error.message });
  }
};

exports.getSellerDetails = async (req, res) => {
  try {
    const seller = await Seller.findById(req.params.id).select('-password');
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }
    res.json(seller);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching seller details', error: error.message });
  }
};

exports.updateSellerVerification = async (req, res) => {
  try {
    const { verified } = req.body;
    const seller = await Seller.findByIdAndUpdate(
      req.params.id,
      { verified },
      { new: true }
    ).select('-password');

    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    res.json(seller);
  } catch (error) {
    res.status(500).json({ message: 'Error updating seller verification', error: error.message });
  }
};

exports.scheduleSurvey = async (req, res) => {
  try {
    const { sellerId, surveyorId, scheduledDate, notes } = req.body;
    const seller = await Seller.findById(sellerId);

    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }

    const survey = new Survey({
      user: sellerId,
      type: 'warehouse',
      surveyDate: scheduledDate,
      surveyor: surveyorId,
      status: 'requested',
      Notes: notes,
    });

    await survey.save();

    res.json({ message: 'Survey scheduled successfully', survey });
  } catch (error) {
    res.status(500).json({ message: 'Error scheduling survey', error: error.message });
  }
};

