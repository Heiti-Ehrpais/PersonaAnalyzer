import { useState, useEffect } from 'react';
import { fetchMessages } from '../services/api';

interface Message {
  id: number;
  chatId: number;
  senderId: number;
  message: string;
  createdAt: string;
}

const useMessages = (chatId: number) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMessages = async () => {
      setLoading(true);
      try {
        const messages = await fetchMessages(chatId);
        console.log("messages??",messages)
        setMessages(Array.isArray(messages) ? messages : []);
        console.log("messages",messages)
        setError(null);
      } catch (error) {
        setError('Failed to fetch messages');
      } finally {
        setLoading(false);
      }
    };

    if (chatId) {
      console.log("load messages again?")
      loadMessages();
    }
  }, [chatId]);

  return { messages, loading, error, setMessages };
};

export default useMessages;
