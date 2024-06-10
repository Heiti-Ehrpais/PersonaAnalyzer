import React, { useState } from 'react';
import { sendMessage } from '../services/api';
import { FiArrowUp, FiLoader } from 'react-icons/fi';

interface SendMessageProps {
  chatId: number;
  senderId: number;
  onMessageSent: () => void;
}

function SendMessage({ chatId, senderId, onMessageSent }: SendMessageProps) {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true); // Set loading to true when the request starts
    try {
      await sendMessage(chatId, { senderId, message });
      setMessage(''); // Clear the message input after sending
      onMessageSent(); // Call the callback function to update the message list
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false); // Set loading to false when the request finishes
    }
  };

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      await handleSendMessage(event as unknown as React.FormEvent);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 w-full flex items-center p-4 bg-gray-800 animate-fade-in">
      <form onSubmit={handleSendMessage} className="flex w-full max-w-4xl mx-auto">
        <textarea
          className="flex-grow p-2 mr-2 text-white bg-gray-700 border-none rounded-lg focus:ring-2 focus:ring-blue-500 resize-none max-w-full"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message here"
          required
          style={{ maxWidth: 'calc(100% - 48px)' }} // Ensure the textarea doesn't overlap the button
        ></textarea>
        <button
          type="submit"
          className="p-2 text-white bg-gray-600 rounded-full hover:bg-gray-500"
          disabled={isLoading} // Disable the button when loading
        >
          {isLoading ? (
            <FiLoader className="w-6 h-6 animate-spin" /> // Show loading spinner when loading
          ) : (
            <FiArrowUp className="w-6 h-6" />
          )}
        </button>
      </form>
    </div>
  );
}

export default SendMessage;
