import React, { useState, useEffect } from "react";
import { Box, Grid, Typography, CircularProgress } from "@mui/material";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import api from "../../api/axios";

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const response = await api.get('/admin/analytics');
        setAnalyticsData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  const COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#0088FE"];

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!analyticsData) {
    return <Typography>No data available</Typography>;
  }

  return (
    <Box sx={{ mt: 8 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Analytics Dashboard
      </Typography>

      <Box sx={{ mt: 4 }}>
        <Grid container spacing={4}>
          {/* Line Chart */}
          <Grid item xs={12}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Monthly User Growth
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData.lineChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="sellers" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </Grid>

          {/* Bar Chart */}
          <Grid item xs={12}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Sales by Category
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Grid>

          {/* Pie Chart */}
          <Grid item xs={12}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Order Status Breakdown
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={analyticsData.pieChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {analyticsData.pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Analytics;

