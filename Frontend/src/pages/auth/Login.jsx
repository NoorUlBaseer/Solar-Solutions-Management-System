import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  Box,
  Grid,
  Container,
  Typography,
  Button,
  Paper,
  Alert,
  Card,
  CardContent,
} from "@mui/material";
import { setCredentials } from "../../store/slices/authSlice";
import { TextInput } from "../../components/form/TextInput";
import Logo from "../../components/common/Logo";
import api from "../../api/axios";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

const solutions = [
  {
    title: "Commercial Solutions",
    description:
      "Commercial solar installation & service for business, nonprofit, & government buildings",
  },
  {
    title: "Solar On-Grid Solutions",
    description:
      "Send excess power generated back to the grid when you are overproducing so you credit it for later use",
  },
  {
    title: "Solar Off-Grid Solutions",
    description:
      "Once solar power is used by the appliances in your property, any excess power will be sent to your battery bank.",
  },
  {
    title: "Solar Hybrid Solutions",
    description:
      "An additional inverter combines your solar PV, mains, batteries, and optional generator into one.",
  },
];

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState("");

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await api.post("/auth/login", values);
      const { user, token, role } = response.data;
      dispatch(setCredentials({ user, token, role }));

      if (role === "seller") {
        navigate("/seller/dashboard");
      } else if (role === "user") {
        navigate("/user/dashboard");
      } else if (role === "admin") {
        navigate("/admin/dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to login");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        width: "100vw",
        minHeight: "100vh",
        background: "linear-gradient(45deg, #0052A4, #FF6B00)",
        color: "white",
      }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
          sx={{
            position: "absolute",
            top: 16,
            left: 16,
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}>
          <Logo variant="home" />
        </Box>

        <Grid container spacing={4} alignItems="center" mt={9}>
          <Grid item xs={12} md={5}>
            <Paper
              elevation={4}
              sx={{
                p: 4,
                borderRadius: 2,
                backgroundColor: "white",
                color: "#333",
              }}>
              <Typography variant="h4" sx={{ mb: 4, textAlign: "center" }}>
                Welcome Back
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <Formik
                initialValues={{ email: "", password: "" }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}>
                {({ isSubmitting }) => (
                  <Form>
                    <TextInput
                      name="email"
                      label="Email"
                      type="email"
                      fullWidth
                      margin="normal"
                    />
                    <TextInput
                      name="password"
                      label="Password"
                      type="password"
                      fullWidth
                      margin="normal"
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      size="large"
                      disabled={isSubmitting}
                      sx={{ mt: 3 }}>
                      {isSubmitting ? "Logging in..." : "Login"}
                    </Button>
                  </Form>
                )}
              </Formik>

              <Box sx={{ mt: 3, textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?{" "}
                  <Button
                    color="primary"
                    onClick={() => navigate("/register")}
                    sx={{ textTransform: "none" }}>
                    Sign up
                  </Button>
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={7}>
            <Typography variant="h4" sx={{ mb: 4 }}>
              Our Solutions
            </Typography>
            <Grid container spacing={3}>
              {solutions.map((solution, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" component="div">
                        {solution.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {solution.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Login;
