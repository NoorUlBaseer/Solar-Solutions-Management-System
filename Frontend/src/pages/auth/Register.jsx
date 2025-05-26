import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { TextInput } from "../../components/form/TextInput";
import Logo from "../../components/common/Logo";
import api from "../../api/axios";

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
  role: Yup.string()
    .oneOf(["user", "seller"], "Invalid role")
    .required("Role is required"),
});

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const route =
        values.role === "user" ? "/auth/register" : "/auth/register";
      await api.post(route, values);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to register");
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
        <Paper elevation={2} sx={{ p: 4, borderRadius: 2, mt: 12 }}>
          <Typography variant="h4" sx={{ mb: 4, textAlign: "center" }}>
            Create Account
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Formik
            initialValues={{
              name: "",
              email: "",
              password: "",
              confirmPassword: "",
              role: "user",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}>
            {({ isSubmitting, values, setFieldValue }) => (
              <Form>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextInput name="name" label="Full Name" fullWidth />
                  </Grid>
                  <Grid item xs={12}>
                    <TextInput name="email" label="Email Address" fullWidth />
                  </Grid>
                  <Grid item xs={12}>
                    <TextInput
                      name="password"
                      label="Password"
                      type="password"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextInput
                      name="confirmPassword"
                      label="Confirm Password"
                      type="password"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <RadioGroup
                      aria-label="role"
                      name="role"
                      value={values.role}
                      onChange={(e) => setFieldValue("role", e.target.value)}
                      row>
                      <FormControlLabel
                        value="user"
                        control={<Radio />}
                        label="User"
                      />
                      <FormControlLabel
                        value="seller"
                        control={<Radio />}
                        label="Seller"
                      />
                    </RadioGroup>
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      size="large"
                      disabled={isSubmitting}>
                      {isSubmitting ? "Creating Account..." : "Create Account"}
                    </Button>
                  </Grid>
                </Grid>
              </Form>
            )}
          </Formik>

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{" "}
              <Button
                color="primary"
                onClick={() => navigate("/login")}
                sx={{ textTransform: "none" }}>
                Login
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;
