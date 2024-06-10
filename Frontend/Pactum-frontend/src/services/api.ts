// src/services/api.ts
const API_BASE_URL = 'http://localhost:3000';
import { ChatCreation } from '../types/Messages';
export const fetchUsers = async () => {
  const response = await fetch(`${API_BASE_URL}/users`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const fetchChats = async () => {
  const response = await fetch(`${API_BASE_URL}/chats/${1}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const fetchMessages = async (chatId: number) => {
  const response = await fetch(`${API_BASE_URL}/chats/${chatId}/messages`);
  const text = await response.text(); // Read the response as text
  console.log('Response text:', text); // Log the response text
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return JSON.parse(text); // Parse the text as JSON
};

export const createUser = async (user: { username: string; email: string }) => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const createChat = async (chat:ChatCreation) => {
  // Fetch existing chats to check for duplicates
  const existingChatsResponse = await fetch(`${API_BASE_URL}/chats?supplierId=${chat.supplierId}&customerId=${chat.customerId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!existingChatsResponse.ok) {
    throw new Error('Network response was not ok when fetching existing chats');
  }

  const existingChats = await existingChatsResponse.json();

  // Check if a chat with the same supplierId and customerId already exists
  if (existingChats.length > 0) {
    return existingChats[0]; // Return the existing chat
  }

  // If no existing chat, create a new one
  const response = await fetch(`${API_BASE_URL}/chats`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(chat),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
};


export const sendMessage = async (chatId: number, message: { senderId: number; message: string }) => {
  console.log("sending", message, chatId)
  message.senderId = 1;
  const response = await fetch(`${API_BASE_URL}/chats/${chatId}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });

  console.log("response",response)
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};
export const fetchSupplier = async (supplierId: number) => {
  const response = await fetch(`${API_BASE_URL}/users/${supplierId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch supplier');
  }
  return response.json();
};