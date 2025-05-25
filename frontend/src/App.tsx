import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import UserList from './components/UserList';
import CityList from './components/CityList';

function App() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Database Tables
        </Typography>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Cities
          </Typography>
          <Paper sx={{ p: 2 }}>
            <CityList />
          </Paper>
        </Box>

        <Box>
          <Typography variant="h5" gutterBottom>
            Users
          </Typography>
          <Paper sx={{ p: 2 }}>
            <UserList />
          </Paper>
        </Box>
      </Box>
    </Container>
  );
}

export default App; 