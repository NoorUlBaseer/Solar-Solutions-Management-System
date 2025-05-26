const FreeFuel = require('../../models/FreeFuel');

exports.getSolutions = async (req, res) => {
  try {
    const solutions = await FreeFuel.find().sort({ createdAt: -1 });
    res.json(solutions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching solutions', error: error.message });
  }
};

exports.createSolution = async (req, res) => {
  try {
    const newSolution = new FreeFuel(req.body);
    await newSolution.save();
    res.status(201).json(newSolution);
  } catch (error) {
    res.status(500).json({ message: 'Error creating solution', error: error.message });
  }
};

exports.updateSolution = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedSolution = await FreeFuel.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedSolution) {
      return res.status(404).json({ message: 'Solution not found' });
    }
    res.json(updatedSolution);
  } catch (error) {
    res.status(500).json({ message: 'Error updating solution', error: error.message });
  }
};

exports.deleteSolution = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSolution = await FreeFuel.findByIdAndDelete(id);
    if (!deletedSolution) {
      return res.status(404).json({ message: 'Solution not found' });
    }
    res.json({ message: 'Solution deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting solution', error: error.message });
  }
};

