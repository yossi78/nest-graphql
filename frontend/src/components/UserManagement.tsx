import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  IconButton,
  Stack,
  Alert,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

interface City {
  name: string;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  city: City;
  createdAt: string;
  updatedAt: string;
}

interface GetUsersData {
  users: User[];
}

interface GetUserData {
  user: User;
}

interface GetUserVars {
  id: string;
}

interface CreateUserVars {
  data: FormData;
}

interface UpdateUserVars {
  id: string;
  data: FormData;
}

interface DeleteUserVars {
  id: string;
}

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      firstName
      lastName
      birthDate
      city {
        name
      }
      createdAt
      updatedAt
    }
  }
`;

const GET_USER = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      firstName
      lastName
      birthDate
      city {
        name
      }
    }
  }
`;

const CREATE_USER = gql`
  mutation CreateUser($data: CreateUserInput!) {
    createUser(data: $data) {
      id
      firstName
      lastName
      city {
        name
      }
    }
  }
`;

const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $data: UpdateUserInput!) {
    updateUser(id: $id, data: $data) {
      id
      firstName
      lastName
      city {
        name
      }
    }
  }
`;

const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

const CITIES = ['OR_YEHUDA', 'TEL_AVIV', 'JERUSALEM', 'HAIFA'] as const;
type CityType = typeof CITIES[number];

interface FormData {
  firstName: string;
  lastName: string;
  birthDate: string;
  city: CityType;
}

function UserManagement() {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [searchId, setSearchId] = useState('');
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    birthDate: '',
    city: 'OR_YEHUDA'
  });

  const { loading, error, data, refetch } = useQuery<GetUsersData>(GET_USERS);
  const [createUser] = useMutation<User, CreateUserVars>(CREATE_USER);
  const [updateUser] = useMutation<User, UpdateUserVars>(UPDATE_USER);
  const [deleteUser] = useMutation<boolean, DeleteUserVars>(DELETE_USER);
  const { data: searchedUser, refetch: refetchUser } = useQuery<GetUserData, GetUserVars>(GET_USER, {
    variables: { id: searchId },
    skip: !searchId
  });

  const handleOpen = () => {
    setOpen(true);
    setIsEditing(false);
    setFormData({
      firstName: '',
      lastName: '',
      birthDate: '',
      city: 'OR_YEHUDA'
    });
  };

  const handleEdit = (user: User) => {
    setIsEditing(true);
    setCurrentUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      birthDate: user.birthDate.split('T')[0],
      city: user.city.name.replace(/-/g, '_').toUpperCase() as CityType
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentUser(null);
  };

  const handleSubmit = async () => {
    try {
      // Convert date to ISO format with time
      const formattedData = {
        ...formData,
        birthDate: new Date(formData.birthDate + 'T00:00:00').toISOString()
      };

      if (isEditing && currentUser) {
        await updateUser({
          variables: {
            id: currentUser.id,
            data: formattedData
          }
        });
      } else {
        await createUser({
          variables: {
            data: formattedData
          }
        });
      }
      refetch();
      handleClose();
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser({ variables: { id } });
        refetch();
      } catch (err) {
        console.error('Error:', err);
      }
    }
  };

  const handleSearch = () => {
    if (searchId) {
      refetchUser({ id: searchId });
    }
  };

  if (loading) return <Alert severity="info">Loading...</Alert>;
  if (error) return <Alert severity="error">Error: {error.message}</Alert>;

  return (
    <Box>
      <Stack spacing={2} sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Search User by ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            size="small"
          />
          <Button variant="contained" onClick={handleSearch}>
            Search
          </Button>
          <Button variant="contained" color="primary" onClick={handleOpen}>
            Add New User
          </Button>
        </Box>

        {searchedUser?.user && (
          <Alert severity="info">
            Found user: {searchedUser.user.firstName} {searchedUser.user.lastName} from {searchedUser.user.city.name}
          </Alert>
        )}
      </Stack>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEditing ? 'Edit User' : 'Add New User'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              fullWidth
            />
            <TextField
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              fullWidth
            />
            <TextField
              label="Birth Date"
              type="date"
              value={formData.birthDate}
              onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth>
              <InputLabel>City</InputLabel>
              <Select
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value as CityType })}
                label="City"
              >
                {CITIES.map((city) => (
                  <MenuItem key={city} value={city}>
                    {city.replace(/_/g, '-')}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {isEditing ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {data?.users?.map((user: User) => (
        <Box
          key={user.id}
          sx={{
            p: 2,
            mb: 2,
            border: '1px solid #ddd',
            borderRadius: 1,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Box>
            <strong>ID: {user.id}</strong> - {user.firstName} {user.lastName}
            <br />
            City: {user.city.name}
            <br />
            Birth Date: {new Date(user.birthDate).toLocaleDateString()}
          </Box>
          <Box>
            <IconButton onClick={() => handleEdit(user)} color="primary">
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleDelete(user.id)} color="error">
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

export default UserManagement; 