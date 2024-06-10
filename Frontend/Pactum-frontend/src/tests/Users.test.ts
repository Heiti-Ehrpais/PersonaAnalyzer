// src/components/Users.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Users from '../components/Users';
import { fetchUsers, createUser } from '../services/api';

// Mock the API functions
jest.mock('../services/api');

describe('Users Component', () => {
  const mockedFetchUsers = fetchUsers as jest.MockedFunction<typeof fetchUsers>;
  const mockedCreateUser = createUser as jest.MockedFunction<typeof createUser>;

  beforeEach(() => {
    mockedFetchUsers.mockClear();
    mockedCreateUser.mockClear();
  });

  it('loads and displays users', async () => {
    const users = [
      { id: 1, username: 'user1', email: 'user1@example.com' },
      { id: 2, username: 'user2', email: 'user2@example.com' }
    ];
    mockedFetchUsers.mockResolvedValueOnce(users);

    render(<Users />);

    // Wait for the users to be loaded
    await waitFor(() => expect(mockedFetchUsers).toHaveBeenCalledTimes(1));

    // Check if the users are displayed
    users.forEach(user => {
      expect(screen.getByText(`${user.username} (${user.email})`)).toBeInTheDocument();
    });
  });

  it('creates a new user', async () => {
    const newUser = { id: 3, username: 'newuser', email: 'newuser@example.com' };
    mockedCreateUser.mockResolvedValueOnce(newUser);
    mockedFetchUsers.mockResolvedValueOnce([]);

    render(<Users />);

    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText('Username'), { target: { value: 'newuser' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'newuser@example.com' } });

    // Click the create button
    fireEvent.click(screen.getByText('Create'));

    // Wait for the new user to be created and added to the list
    await waitFor(() => expect(mockedCreateUser).toHaveBeenCalledTimes(1));

    // Check if the new user is displayed
    expect(screen.getByText(`${newUser.username} (${newUser.email})`)).toBeInTheDocument();
  });
});
