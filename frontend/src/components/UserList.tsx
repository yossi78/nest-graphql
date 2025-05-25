import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  CircularProgress,
  Alert
} from '@mui/material';

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

interface User {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  city: {
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

function UserList() {
  const { loading, error, data } = useQuery(GET_USERS);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">Error: {error.message}</Alert>;

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>First Name</TableCell>
            <TableCell>Last Name</TableCell>
            <TableCell>Birth Date</TableCell>
            <TableCell>City</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell>Updated At</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.users.map((user: User) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.firstName}</TableCell>
              <TableCell>{user.lastName}</TableCell>
              <TableCell>{new Date(user.birthDate).toLocaleDateString()}</TableCell>
              <TableCell>{user.city.name}</TableCell>
              <TableCell>{new Date(user.createdAt).toLocaleString()}</TableCell>
              <TableCell>{new Date(user.updatedAt).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default UserList; 