const Installation = require('../../models/Installation');

exports.getInstallations = async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = {};

    if (status && status !== 'All') {
      query.status = status.toLowerCase();
    }

    if (search) {
      query.$or = [
        { 'userId.name': { $regex: search, $options: 'i' } },
        { 'freeFuelId.name': { $regex: search, $options: 'i' } },
      ];
    }

    const installations = await Installation.find(query)
      .populate('userId', 'name email phone')
      .populate('freeFuelId');

    res.json(installations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching installations', error: error.message });
  }
};

exports.getInstallationDetails = async (req, res) => {
  try {
    const installation = await Installation.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('freeFuelId');

    if (!installation) {
      return res.status(404).json({ message: 'Installation not found' });
    }

    res.json(installation);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching installation details', error: error.message });
  }
};

exports.updateInstallationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const installation = await Installation.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('userId', 'name email phone')
     .populate('freeFuelId');

    if (!installation) {
      return res.status(404).json({ message: 'Installation not found' });
    }

    res.json(installation);
  } catch (error) {
    res.status(500).json({ message: 'Error updating installation status', error: error.message });
  }
};

