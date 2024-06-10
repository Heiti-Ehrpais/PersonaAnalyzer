import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';
import sequelize from './config/database';
import User from './models/User';
import Chat from './models/Chat';
import Message from './models/Message';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const flaskApiUrl = process.env.FLASK_API_URL || 'http://localhost:5000';

// Enable CORS
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend URL
  credentials: true
}));

// Middleware to parse JSON requests
app.use(express.json());

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

const axiosInstance = axios.create({
  baseURL: flaskApiUrl,
  withCredentials: true
});

// Simple route for testing
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Route to create a new user
app.post('/users', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err: any) {
    console.error('Error creating user:', err);
    res.status(400).json({ error: err.message });
  }
});

// Route to get all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (err: any) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get user by ID
app.get('/users/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (err: any) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: err.message });
  }
});

// Route to create a new chat
app.post('/chats', async (req, res) => {
  try {
    const { supplierId, customerId } = req.body;
    const chat = await Chat.create({ supplierId, customerId });
    res.status(201).json(chat);
  } catch (err: any) {
    console.error('Error creating chat:', err);
    res.status(400).json({ error: err.message });
  }
});

// Route to get all chats
app.get('/chats', async (req, res) => {
  try {
    const chats = await Chat.findAll();
    res.status(200).json(chats);
  } catch (err: any) {
    console.error('Error fetching chats:', err);
    res.status(500).json({ error: err.message });
  }
});

// Route to get all chats by user id
app.get('/chats/:id', async (req, res) => {
  try {
    const chats = await Chat.findAll({
      where: {
        supplierId: req.params.id,
      },
    });

    for (const chat of chats) {
      const supplier = await User.findByPk(chat.supplierId);
      const customer = await User.findByPk(chat.customerId);
      chat.setDataValue('supplierName', supplier?.username);
      chat.setDataValue('customerName', customer?.username);
    }
    res.status(200).json(chats);
  } catch (err: any) {
    console.error('Error fetching chats:', err);
    res.status(500).json({ error: err.message });
  }
});
// Route to send a message in a chat
app.post('/chats/:chatId/messages', async (req, res) => {
  try {
    const { chatId } = req.params;
    const { senderId, message } = req.body;

    const chat = await Chat.findByPk(chatId);
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    

    let response;

    // Check if message contains persona
    if (message.includes('persona')) {
      console.log("Setting persona");
      const persona = message.split('persona')[1].trim();
      response = await axiosInstance.post('/set_persona', { persona: persona });
      if (response.status === 200) {
        return res.status(200).json({ message: 'Persona set successfully' });
      } else {
        return res.status(response.status).json({ error: response.data });
      }
    } else {
      const newMessage = await Message.create({ chatId: Number(chatId), senderId, message });
      response = await axiosInstance.post('/query', { query: message.trim() });
      if (response.status === 200) {
        // Create a new message with the response
        console.log("response.data", response.data);
        const newResponseMessage = await Message.create({
          chatId: Number(chatId),
          senderId: chat.customerId,
          message: response.data.answer // Use only the answer string
        });
        return res.status(201).json(newResponseMessage);
      } else {
        console.log("response.data.failed", response.data);
        return res.status(response.status).json({ error: response.data });
      }
    }

  } catch (err:any) {
    console.error('Error sending message:', err);
    res.status(400).json({ error: err.message });
  }
});


// Route to get messages in a chat
app.get('/chats/:chatId/messages', async (req, res) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findByPk(chatId, {
      include: [{
        model: Message,
        as: 'messages'
      }]
    });
    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    res.status(200).json(chat.messages);
  } catch (err: any) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: err.message });
  }
});

// Route to upload file to the Flask API
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname);

    const response = await axiosInstance.post(`${flaskApiUrl}/upload`, formData, {
      headers: formData.getHeaders(),
    });

    res.status(response.status).json(response.data);
  } catch (err: any) {
    console.error('Error uploading file:', err);
    res.status(500).json({ error: err.message });
  }
});

// Route to set persona using the Flask API
app.post('/set_persona', async (req, res) => {
  try {
    const { persona } = req.body;
    const response = await axiosInstance.post(`${flaskApiUrl}/set_persona`, { persona });

    res.status(response.status).json(response.data);
  } catch (err: any) {
    console.error('Error setting persona:', err);
    res.status(500).json({ error: err.message });
  }
});

// Route to query the Flask API
app.post('/query', async (req, res) => {
  try {
    const { query } = req.body;
    console.log("starting query", query)
    const response = await axiosInstance.post(`${flaskApiUrl}/query`, { query });

    res.status(response.status).json(response.data);
  } catch (err: any) {
    console.error('Error querying:', err);
    res.status(500).json({ error: err.message });
  }
});

// Route to clear session in the Flask API
app.post('/clear_session', async (req, res) => {
  try {
    const response = await axiosInstance.post(`${flaskApiUrl}/clear_session`);

    res.status(response.status).json(response.data);
  } catch (err: any) {
    console.error('Error clearing session:', err);
    res.status(500).json({ error: err.message });
  }
});

let server: any;
console.log("process.env.NODE_ENV", process.env.NODE_ENV);
if (process.env.NODE_ENV !== 'test') {
  server = app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });

  sequelize.authenticate()
    .then(() => {
      console.log('Connection has been established successfully.');
      return sequelize.sync();
    })
    .then(() => {
      console.log('Database synchronized successfully.');
    })
    .catch((err: any) => {
      console.error('Unable to connect to the database:', err.message);
    });
}

export { app, server };
