const Consultation = require('../../models/Consultation');

exports.getConsultations = async (req, res) => {
  try {
    const consultations = await Consultation.find().populate('user', 'name');
    res.json(consultations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching consultations', error: error.message });
  }
};

exports.addReply = async (req, res) => {
  try {
    const { consultationId, questionId, reply } = req.body;
    const consultation = await Consultation.findById(consultationId);

    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }

    const question = consultation.questions.id(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    question.replies.push(reply);
    await consultation.save();

    res.json(consultation);
  } catch (error) {
    res.status(500).json({ message: 'Error adding reply', error: error.message });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const { consultationId, questionId } = req.params;
    const consultation = await Consultation.findById(consultationId);

    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }

    consultation.questions = consultation.questions.filter(
      (question) => question._id.toString() !== questionId
    );

    await consultation.save();

    res.json(consultation);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting question', error: error.message });
  }
};

