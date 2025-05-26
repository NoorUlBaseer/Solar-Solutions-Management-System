import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import {
  SolarPower,
  Calculate,
  Engineering,
  MonetizationOn,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const UserDashboard = () => {
  const navigate = useNavigate();
  const [systemData, setSystemData] = useState({
    currentPower: 0,
    dailySavings: 0,
    monthlyProduction: 0,
    nextMaintenance: null,
  });

  const powerData = {
    labels: ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM'],
    datasets: [{
      label: 'Power Generation (kW)',
      data: [0, 2.5, 4.8, 5.2, 3.1, 0],
      borderColor: '#0052A4',
      tension: 0.4,
    }],
  };

  useEffect(() => {
    // Simulate fetching user's solar system data
    setSystemData({
      currentPower: 4.2,
      dailySavings: 12.50,
      monthlyProduction: 450,
      nextMaintenance: '2024-04-15',
    });
  }, []);

  const QuickActionCard = ({ title, icon, description, action }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {icon}
          <Typography variant="h6" sx={{ ml: 1 }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {description}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={action}
          fullWidth
        >
          Get Started
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Welcome to Your Solar Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* System Status */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Current System Status
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" color="text.secondary">
                  Current Power Output
                </Typography>
                <Typography variant="h4">
                  {systemData.currentPower} kW
                </Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" color="text.secondary">
                  Today's Savings
                </Typography>
                <Typography variant="h4">
                  ${systemData.dailySavings}
                </Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" color="text.secondary">
                  Monthly Production
                </Typography>
                <Typography variant="h4">
                  {systemData.monthlyProduction} kWh
                </Typography>
              </Grid>
              <Grid item xs={12} md={3}>
                <Typography variant="subtitle2" color="text.secondary">
                  Next Maintenance
                </Typography>
                <Typography variant="h4">
                  {new Date(systemData.nextMaintenance).toLocaleDateString()}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Power Generation Graph */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Today's Power Generation
            </Typography>
            <Line data={powerData} options={{
              responsive: true,
              plugins: {
                legend: {
                  position: 'top',
                },
              },
            }} />
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Quick Actions
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <QuickActionCard
                title="Solar Calculator"
                icon={<Calculate color="primary" />}
                description="Calculate your potential savings with solar power"
                action={() => navigate('/user/calculator')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <QuickActionCard
                title="Request Survey"
                icon={<Engineering color="primary" />}
                description="Schedule a professional house survey"
                action={() => navigate('/user/RequestSurvey')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <QuickActionCard
                title="Shop Parts"
                icon={<SolarPower color="primary" />}
                description="Browse and purchase solar equipment"
                action={() => navigate('/user/shop')}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <QuickActionCard
                title="View Savings"
                icon={<MonetizationOn color="primary" />}
                description="Track your energy savings over time"
                action={() => navigate('/user/savings')}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserDashboard;