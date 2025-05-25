import React, { useState } from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, gql, useQuery, useMutation } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache(),
});

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

const CREATE_USER = gql`
  mutation CreateUser($data: CreateUserInput!) {
    createUser(data: $data) {
      id
      firstName
      lastName
    }
  }
`;

const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $data: UpdateUserInput!) {
    updateUser(id: $id, data: $data) {
      id
      firstName
      lastName
    }
  }
`;

const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

function UserList() {
  const { loading, error, data } = useQuery(GET_USERS);
  const [deleteUser] = useMutation(DELETE_USER, {
    refetchQueries: [{ query: GET_USERS }],
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Birth Date</th>
            <th>City</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.users.map((user: any) => (
            <tr key={user.id}>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{new Date(user.birthDate).toLocaleDateString()}</td>
              <td>{user.city.name}</td>
              <td>
                <button onClick={() => deleteUser({ variables: { id: user.id } })}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CreateUserForm() {
  const [createUser] = useMutation(CREATE_USER, {
    refetchQueries: [{ query: GET_USERS }],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    createUser({
      variables: {
        data: {
          firstName: formData.get('firstName'),
          lastName: formData.get('lastName'),
          birthDate: formData.get('birthDate'),
          city: formData.get('city'),
        },
      },
    });

    form.reset();
  };

  return (
    <div>
      <h2>Create User</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name:</label>
          <input type="text" name="firstName" required />
        </div>
        <div>
          <label>Last Name:</label>
          <input type="text" name="lastName" required />
        </div>
        <div>
          <label>Birth Date:</label>
          <input type="datetime-local" name="birthDate" required />
        </div>
        <div>
          <label>City:</label>
          <select name="city" required>
            <option value="OR_YEHUDA">Or-Yehuda</option>
            <option value="TEL_AVIV">Tel-Aviv</option>
            <option value="JERUSALEM">Jerusalem</option>
            <option value="HAIFA">Haifa</option>
          </select>
        </div>
        <button type="submit">Create User</button>
      </form>
    </div>
  );
}

function App() {
  return (
    <ApolloProvider client={client}>
      <div style={{ padding: '20px' }}>
        <h1>User Management System</h1>
        <CreateUserForm />
        <UserList />
      </div>
    </ApolloProvider>
  );
}

export default App; 