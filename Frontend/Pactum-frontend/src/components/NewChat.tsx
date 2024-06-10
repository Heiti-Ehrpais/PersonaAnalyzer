// src/components/NewChat.tsx
import React, { useState, useEffect } from 'react';
import { fetchUsers, createChat } from '../services/api';

interface User {
  id: number;
  username: string;
  email: string;
}
interface ChatProps {
  supplierId: number;
  onChatCreated: () => void;
}

const NewChat = ({ onChatCreated, supplierId }:ChatProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [customerId, setCustomerId] = useState<number | null>(null);

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

  const handleCreateChat = async () => {
    console.log("creating chat", supplierId, customerId)
    if (supplierId && customerId) {
      try {
        await createChat({ supplierId, customerId });
        onChatCreated(); // Notify parent component that a chat has been created
        console.log("chat created")
      } catch (error) {
        console.error('Failed to create chat:', error);
      }
    }
  };

  return (
    <div>
      <h2>Start New Chat</h2>
      <div>
        <label>Customer:</label>
        <select onChange={(e) => setCustomerId(Number(e.target.value))} value={customerId ?? ''}>
          <option value="">Select Customer</option>
          {users.map(user => (
            <option key={user.id} value={user.id}>{user.username}</option>
          ))}
        </select>
      </div>
      <button onClick={handleCreateChat} disabled={!supplierId || !customerId}>Create Chat</button>
    </div>
  );
};

export default NewChat;
