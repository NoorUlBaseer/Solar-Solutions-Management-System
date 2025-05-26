import { Box, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/common/Logo';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Box 
      sx={{ 
        width: '100vw',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(45deg, #0052A4, #FF6B00)', // Background gradient
        color: 'white', // Text color
        backgroundColor: 'background.default',
      }}
    >
      <Box 
        sx={{ 
          p: 2, 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.3)' // Adjusted to suit white theme
        }}
      >
        {/* Logo Section */}
        <Box
        sx={{
          cursor: 'pointer',
        }}
          onClick={() => navigate('/')}
        >
          <Logo variant="home" />
        </Box>
        <Box>
          <Button 
            variant="contained" 
            color="inherit" // Make button text white
            onClick={() => navigate('/login')}
            sx={{ mr: 2, backgroundColor: 'white', color: '#0052A4' }}
          >
            Login
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => navigate('/register')}
            sx={{
              backgroundColor: '#0052A4', 
              color: 'white',
              '&:hover': {
                backgroundColor: 'white', 
                color: '#0052A4',
              },
            }}
          >
            Register
          </Button>
        </Box>
      </Box>
      <Container maxWidth="lg" sx={{ mt: 8, textAlign: 'center' }}>
        <Typography 
          variant="h1" 
          sx={{ 
            mb: 3,
            color: 'white', // White text
          }}
        >
          FreeFuel, a thoughtful partner. Power Your Future with Solar Energy
        </Typography>
        <Typography variant="h5" sx={{ mb: 4, color: 'rgba(255, 255, 255, 0.8)' }}>
          Sustainable solutions for a brighter tomorrow
        </Typography>
        <Button 
          variant="contained" 
          color="secondary" 
          size="large"
          onClick={() => navigate('/register')}
          sx={{ mr: 2, backgroundColor: '#FF6B00', color: 'white' }}
        >
          Get Started
        </Button>
        <Button 
          variant="outlined" 
          size="large"
          onClick={() => navigate('/calculator')}
          sx={{
            borderColor: 'white',
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.2)', // Hover effect
            },
          }}
        >
          Calculate Savings
        </Button>
      </Container>
    </Box>
  );
};

export default Home;
