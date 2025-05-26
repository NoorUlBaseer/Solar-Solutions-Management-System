// Backend/controllers/admin/securityController.js

const Escalation = require('../../models/Escalation');
const User = require('../../models/User');
const Seller = require('../../models/Seller');

exports.getEscalations = async (req, res) => {
  try {
    const escalations = await Escalation.find()
      .populate('user', 'name')
      .populate('seller', 'name');
    res.json(escalations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching escalations', error: error.message });
  }
};

exports.getEscalationDetails = async (req, res) => {
  try {
    const escalation = await Escalation.findById(req.params.id)
      .populate('user', 'name')
      .populate('seller', 'name');
    if (!escalation) {
      return res.status(404).json({ message: 'Escalation not found' });
    }
    res.json(escalation);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching escalation details', error: error.message });
  }
};

exports.updateEscalation = async (req, res) => {
  try {
    const { adminResponse, decision } = req.body;
    const escalation = await Escalation.findByIdAndUpdate(
      req.params.id,
      { adminResponse, decision },
      { new: true }
    );

    if (!escalation) {
      return res.status(404).json({ message: 'Escalation not found' });
    }

    // Handle user or seller deletion based on the decision
    if (decision === 'user') {
      await User.findByIdAndDelete(escalation.user);
    } else if (decision === 'seller') {
      await Seller.findByIdAndDelete(escalation.seller);
    }

    res.json(escalation);
  } catch (error) {
    res.status(500).json({ message: 'Error updating escalation', error: error.message });
  }
};