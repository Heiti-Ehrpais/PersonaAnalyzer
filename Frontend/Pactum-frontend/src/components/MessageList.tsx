import React, { useEffect, useRef } from 'react';
import '../styles.css'; // Import the custom scrollbar styles
import { Message } from '../types/Messages';

interface MessageListProps {
  messages: Message[];
  loading: boolean;
  error: string | null;
}

const MessageList: React.FC<MessageListProps> = ({ messages, loading, error }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (loading) {
    return <div>Loading messages...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col items-center h-full">
      <h2 className="text-xl font-semibold mb-4">Messages</h2>
      <div className="w-[700px] overflow-y-auto pl-40 space-y-4 custom-scrollbar pb-40">
        <ul className="w-full space-y-4">
          {Array.isArray(messages) && messages.map((message) => (
            <li
              key={message.id}
              className={`p-4 rounded-lg max-w-lg ${
                message.senderId === 1 ? ' text-white self-end text-right' : 'bg-gray-200 text-black self-start text-left'
              }`}
            >
              <div>
                <strong>{message.senderId === 1 ? 'You' : `User ${message.senderId}`}</strong>: {message.message}
              </div>
              <div className="text-sm text-gray-600">{new Date(message.createdAt).toLocaleString()}</div>
            </li>
          ))}
          <div ref={messagesEndRef} />
        </ul>
      </div>
    </div>
  );
};

export default MessageList;
