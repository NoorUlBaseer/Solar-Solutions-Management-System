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
  const [sellerData, setSellerData] = useState(null);

  useEffect(() => {
    fetchSellerData();
  }, []);

  const fetchSellerData = async () => {
    try {
      const [profileResponse, productsResponse, ordersResponse] =
        await Promise.all([
          api.get("/sellers/profile"),
          api.get("/sellers/products"),
          api.get("/sellers/orders"),
        ]);
      setSellerData({
        profile: profileResponse.data,
        products: productsResponse.data,
        orders: ordersResponse.data,
      });
    } catch (error) {
      console.error("Error fetching seller data:", error);
    }
  };

  const getChatbotResponse = async (userInput) => {
    try {
      const response = await api.post("/sellers/support/query", {
        query:
          "This is a chatbot developed by FreeFuel, a solar solutions company. It is designed to assist users by answering support-related questions, providing information about products, orders, and company details, and handling generic queries properly. The chatbot has access to the following data: - **Seller Name**: ${sellerData.profile.name} - **Company Name**: ${sellerData.profile.company} - **Number of Products**: ${sellerData.products.length} - **Number of Orders**: ${sellerData.orders.length} The goal of this chatbot is to assist sellers and customers by answering questions related to products, orders, and general company information, and to handle generic inquiries with the context it has access to. It should ensure the answers are helpful, clear, and relevant based on the given data." +
          userInput,
        context: {
          sellerName: sellerData.profile.name,
          companyName: sellerData.profile.company,
          productCount: sellerData.products.length,
          orderCount: sellerData.orders.length,
        },
      });
      return response.data.answer;
    } catch (error) {
      console.error("Error getting chatbot response:", error);
      return "I'm sorry, I couldn't process your request. Please try again later.";
    }
  };

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
      {" "}
      {/* Increased padding-top */}
      {/* Page Header */}
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Solar Solutions Support
      </Typography>
      {/* Chatbot Section */}
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
            placeholder="Ask about solar products, orders, or seller policies..."
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
