import React from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Typography, Box, Button, TextField, Paper } from "@mui/material";
import api from "../../api/axios";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  description: Yup.string().required("Description is required"),
  price: Yup.number()
    .positive("Price must be positive")
    .required("Price is required"),
  stock: Yup.number()
    .integer("Stock must be an integer")
    .min(0, "Stock cannot be negative")
    .required("Stock is required"),
  warranty: Yup.string(),
});

const AddProduct = () => {
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting, setStatus }) => {
    try {
      await api.post("/sellers/products", values);
      navigate("/seller/inventory");
    } catch (error) {
      console.error("Error adding product:", error);
      setStatus("Failed to add product. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 6 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Add New Product
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Formik
          initialValues={{
            name: "",
            description: "",
            price: "",
            stock: "",
            warranty: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}>
          {({ errors, touched, isSubmitting, status }) => (
            <Form>
              <Field
                as={TextField}
                fullWidth
                margin="normal"
                name="name"
                label="Product Name"
                error={touched.name && errors.name}
                helperText={touched.name && errors.name}
              />
              <Field
                as={TextField}
                fullWidth
                margin="normal"
                name="description"
                label="Description"
                multiline
                rows={4}
                error={touched.description && errors.description}
                helperText={touched.description && errors.description}
              />
              <Field
                as={TextField}
                fullWidth
                margin="normal"
                name="price"
                label="Price"
                type="number"
                error={touched.price && errors.price}
                helperText={touched.price && errors.price}
              />
              <Field
                as={TextField}
                fullWidth
                margin="normal"
                name="stock"
                label="Stock"
                type="number"
                error={touched.stock && errors.stock}
                helperText={touched.stock && errors.stock}
              />
              <Field
                as={TextField}
                fullWidth
                margin="normal"
                name="warranty"
                label="Warranty"
                error={touched.warranty && errors.warranty}
                helperText={touched.warranty && errors.warranty}
              />
              {status && <Typography color="error">{status}</Typography>}
              <Box sx={{ mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isSubmitting}>
                  {isSubmitting ? "Adding..." : "Add Product"}
                </Button>
              </Box>
            </Form>
          )}
        </Formik>
      </Paper>
    </Box>
  );
};

export default AddProduct;
