// src/components/UserList.tsx
import React, { useEffect, useState } from 'react';
import { fetchUsers } from '../services/api';

interface User {
  id: number;
  username: string;
  email: string;
}
interface UserListProps {
  onSelectUser: (userId: number) => void;
}

const UserList  = ({ onSelectUser } : UserListProps) => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const users = await fetchUsers();
        setUsers(users);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    loadUsers();
  }, []);

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users.map(user => (
          <li key={user.id} onClick={() => onSelectUser(user.id)}>
            {user.username} ({user.email})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
