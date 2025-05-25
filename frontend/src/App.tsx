import React from 'react';
import { Container, Typography, Box, Paper, Divider } from '@mui/material';
import UserList from './components/UserList';
import CityList from './components/CityList';
import UserManagement from './components/UserManagement';

function App() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          User Management System
        </Typography>
        
        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            User Management
          </Typography>
          <Paper sx={{ p: 2 }}>
            <UserManagement />
          </Paper>
        </Box>

        <Divider sx={{ my: 4 }} />
        
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