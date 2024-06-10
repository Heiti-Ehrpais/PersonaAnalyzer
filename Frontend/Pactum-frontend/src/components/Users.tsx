// src/components/Users.tsx
import React, { useEffect, useState } from 'react';
import { fetchUsers, createUser } from '../services/api';

const Users = (): JSX.Element => {
  const [users, setUsers] = useState<{ id: number; username: string; email: string }[]>([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const loadUsers = async () => {
    console.log("loading users")
      const users = await fetchUsers();
      setUsers(users);
      
    };
    loadUsers();
  }, []);

  const handleCreateUser = async () => {
    console.log('Creating user...');
    const newUser = await createUser({ username, email });
    setUsers([...users, newUser]);
    setUsername('');
    setEmail('');
  };

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.username} ({user.email})
          </li>
        ))}
      </ul>
      <h2>Create User</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleCreateUser}>Create</button>
    </div>
  );
};

export default Users;
