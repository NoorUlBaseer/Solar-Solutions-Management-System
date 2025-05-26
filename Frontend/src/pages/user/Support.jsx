import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Divider,
} from "@mui/material";
import { Send, ContactMail } from "@mui/icons-material";
import api from "../../api/axios";

const Support = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);

  // Fetch user data when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [profileResponse, ordersResponse, purchasedProductsResponse] =
          await Promise.all([
            api.get("/users/profile"),
            api.get("/users/orders"),
            api.get("/users/purchased-products"),
          ]);
        setUserData({
          profile: profileResponse.data,
          orders: ordersResponse.data,
          purchasedProducts: purchasedProductsResponse.data,
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  // Ensure user data is available before making chatbot API calls
  const getChatbotResponse = async (userInput) => {
    if (!userData) {
      return "Please wait while we load your data. Try again in a moment.";
    }

    try {
      const response = await api.post("/user/support/query", {
        query: `This is a chatbot developed by FreeFuel, a solar solutions company. It is designed to assist users by answering support-related questions, providing information about their orders, products, and company details, and handling generic queries properly. The chatbot has access to the following data: - **User Name**: ${userData.profile.name} - **Email**: ${userData.profile.email} - **Number of Orders**: ${userData.orders.length} - **Purchased Products**: ${userData.purchasedProducts.length} The goal of this chatbot is to assist users with their orders, products they have purchased, and general company information, and to handle generic inquiries with the context it has access to.` + userInput,
        context: {
          userName: userData.profile.name,
          userEmail: userData.profile.email,
          orderCount: userData.orders.length,
          purchasedProductCount: userData.purchasedProducts.length,
        },
      });

      return response.data.answer;
    } catch (error) {
      console.error("Error getting chatbot response:", error);
      return "I'm sorry, I couldn't process your request. Please try again later.";
    }
  };

  // Handle user message submission
  const handleSendMessage = async () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: "user" }]);
      setInput("");
      setLoading(true);

      const response = await getChatbotResponse(input);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: response, sender: "bot" },
      ]);
      setLoading(false);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, pt: 7, px: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Solar Solutions Support
      </Typography>
      <Paper
        sx={{
          p: 2,
          mb: 3,
          display: "flex",
          flexDirection: "column",
          height: "70vh",
          justifyContent: "space-between",
        }}>
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            p: 2,
            border: "1px solid #ccc",
            borderRadius: "4px",
          }}>
          {messages.map((message, index) => (
            <Box
              key={index}
              sx={{
                mb: 2,
                textAlign: message.sender === "user" ? "right" : "left",
              }}>
              <Typography
                sx={{
                  display: "inline-block",
                  p: 1.5,
                  borderRadius: "4px",
                  bgcolor:
                    message.sender === "user"
                      ? "primary.main"
                      : "secondary.main",
                  color: "white",
                }}>
                {message.text}
              </Typography>
            </Box>
          ))}
          {loading && (
            <CircularProgress size={24} sx={{ mt: 2, display: "block" }} />
          )}
        </Box>

        {/* Input Section */}
        <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Ask about solar products, orders, or company policies..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSendMessage}
            sx={{ ml: 1 }}
            disabled={loading}>
            <Send />
          </Button>
        </Box>
      </Paper>
      {/* Contact Info Section */}
      <Box sx={{ mt: 4 }}>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Contact Admin
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
          <ContactMail sx={{ fontSize: 40, color: "primary.main", mr: 2 }} />
          <Typography>
            For further assistance, please contact FreeFuel Admin at:{" "}
            <strong>admin@freefuel.com</strong>
          </Typography>
        </Box>
        <Typography>
          Phone: <strong>+1 (555) 123-4567</strong>
        </Typography>
      </Box>
    </Box>
  );
};

export default Support;
