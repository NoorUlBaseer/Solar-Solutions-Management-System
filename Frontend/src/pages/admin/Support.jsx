import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
} from "@mui/material";
import { Delete, Edit, Send } from "@mui/icons-material";
import api from "../../api/axios";

const Support = () => {
  const [consultations, setConsultations] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch consultations data from the backend
  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        setLoading(true);
        const response = await api.get('/admin/consultations');
        setConsultations(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching consultations:", err);
        setError("Failed to fetch consultations. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchConsultations();
  }, []);

  // Handle opening the reply dialog
  const handleReplyDialogOpen = (question, consultationId) => {
    setSelectedQuestion({ ...question, consultationId });
    setReplyText(question.replies?.[0] || ""); // Pre-fill with the first reply if it exists
    setIsDialogOpen(true);
  };

  // Handle adding or updating a reply
  const handleAddOrUpdateReply = async () => {
    try {
      const response = await api.post('/admin/consultations/reply', {
        consultationId: selectedQuestion.consultationId,
        questionId: selectedQuestion._id,
        reply: replyText
      });

      setConsultations((prev) =>
        prev.map((consultation) =>
          consultation._id === selectedQuestion.consultationId ? response.data : consultation
        )
      );

      setIsDialogOpen(false);
      setSelectedQuestion(null);
      setError(null);
    } catch (err) {
      console.error("Error adding/updating reply:", err);
      setError("Failed to add/update reply. Please try again.");
    }
  };

  // Handle deleting a question
  const handleDeleteQuestion = async (consultationId, questionId) => {
    try {
      await api.delete(`/admin/consultations/${consultationId}/questions/${questionId}`);

      setConsultations((prev) =>
        prev.map((consultation) =>
          consultation._id === consultationId
            ? {
                ...consultation,
                questions: consultation.questions.filter((q) => q._id !== questionId),
              }
            : consultation
        )
      );
      setError(null);
    } catch (err) {
      console.error("Error deleting question:", err);
      setError("Failed to delete question. Please try again.");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 8 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Consultation Management
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Question</TableCell>
              <TableCell>Reply</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {consultations.flatMap((consultation) =>
              consultation.questions.map((question) => (
                <TableRow key={question._id}>
                  <TableCell>{consultation.user.name}</TableCell>
                  <TableCell>{question.question}</TableCell>
                  <TableCell>
                    {question.replies?.length ? question.replies[0] : "No reply yet"}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleReplyDialogOpen(question, consultation._id)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDeleteQuestion(consultation._id, question._id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Reply Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{selectedQuestion?.replies?.length ? "Edit Reply" : "Add Reply"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Reply"
            variant="outlined"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            multiline
            rows={4}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleAddOrUpdateReply}>
            {selectedQuestion?.replies?.length ? "Update Reply" : "Send Reply"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Support;

