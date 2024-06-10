import React, { useEffect, useState } from 'react';
import { fetchChats } from '../services/api';

interface Chat {
  id: number;
  supplierId: number;
  customerId: number;
  createdAt: string;
}

interface ChatListProps {
  onSelectChat: (chatId: number) => void;
}

const ChatList = ({ onSelectChat }: ChatListProps): JSX.Element => {
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    const loadChats = async () => {
      try {
        const chats = await fetchChats();
        
        setChats(chats);
      } catch (error) {
        console.error('Failed to fetch chats:', error);
      }
    };

    loadChats();
  }, []);

  return (
    <div>
      <h2>Chats</h2>
      <ul>
        {chats.map(chat => (
          <li key={chat.id} onClick={() => onSelectChat(chat.id)}>
            Chat between {chat.supplierId} and {chat.customerId} ({new Date(chat.createdAt).toLocaleString()})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
