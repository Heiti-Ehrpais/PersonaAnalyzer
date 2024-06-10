import React, { useEffect, useState } from 'react';
import { fetchChats } from '../services/api';
import { Chat } from '../types/Messages';

interface ChatListProps {
  onSelectChat: (chatId: number) => void;
}

function ChatList({ onSelectChat }: ChatListProps) {
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    const loadChats = async () => {
      try {
        const chats = await fetchChats();
        console.log("loading chats",chats)
        setChats(chats);
      } catch (error) {
        console.error('Failed to fetch chats:', error);
      }
    };

    loadChats();
  }, []);

  return (
    <div>
      <ul className="space-y-2">
        {chats.map(chat => (
          <li
            key={chat.id}
            className="p-2 border rounded cursor-pointer hover:bg-gray-700"
            onClick={() => onSelectChat(chat.id)}
          >
            {chat.customerName}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChatList;
