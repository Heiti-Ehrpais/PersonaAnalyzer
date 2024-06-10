import request from 'supertest';
import { app, server } from '../src/index'; // adjust the path to your server file
import sequelize from '../src/config/databaseTest';

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
  if (server) {
    server.close();
  }
});

describe('Test the root path', () => {
  it('should respond with Hello World', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Hello World!');
  });
});

describe('User API', () => {
  it('should create a new user', async () => {
    const response = await request(app)
      .post('/users')
      .send({ username: 'JohnDoe', email: 'john@example.com' });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.username).toBe('JohnDoe');
    expect(response.body.email).toBe('john@example.com');
  });

  it('should get all users', async () => {
    const response = await request(app).get('/users');
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });
});

describe('Chat API', () => {
  it('should create a new chat', async () => {
    const userResponse = await request(app)
      .post('/users')
      .send({ username: 'JaneDoe', email: 'jane@example.com' });
    const userId = userResponse.body.id;

    const response = await request(app)
      .post('/chats')
      .send({ supplierId: userId, customerId: userId });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.supplierId).toBe(userId);
    expect(response.body.customerId).toBe(userId);
  });

  it('should get all chats', async () => {
    const response = await request(app).get('/chats');
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should send a message in a chat', async () => {
    const userResponse = await request(app)
      .post('/users')
      .send({ username: 'SamDoe', email: 'sam@example.com' });
    const userId = userResponse.body.id;

    const chatResponse = await request(app)
      .post('/chats')
      .send({ supplierId: userId, customerId: userId });
    const chatId = chatResponse.body.id;

    const response = await request(app)
      .post(`/chats/${chatId}/messages`)
      .send({ chatId, senderId: userId, message: 'Hello, Sam!' });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.message).toBe('Hello, Sam!');
  });

  it('should get messages in a chat', async () => {
    const response = await request(app).get(`/chats/1/messages`);
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });
});
