import { Sequelize, Transaction } from 'sequelize';
import sequelize from '../src/config/databaseTest';
import User from '../src/models/User';
import Chat from '../src/models/Chat';
import Message from '../src/models/Message';

let transaction: Transaction;

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

beforeEach(async () => {
  transaction = await sequelize.transaction();
});

afterEach(async () => {
  await transaction.rollback();
});

afterAll(async () => {
  await sequelize.close();
});

describe('Chat model', () => {
  it('should create a Chat instance with associated Messages', async () => {
    const supplier = await User.create({ username: 'JohnDoe', email: 'john@example.com' }, { transaction });
    const customer = await User.create({ username: 'Mark', email: 'mark@example.com' }, { transaction });
    const chat = await Chat.create({ supplierId: supplier.id, customerId: customer.id }, { transaction });

    const message = await Message.create({
      chatId: chat.id,
      senderId: supplier.id,
      message: 'Hello, world!',
    }, { transaction });

    const fetchedChat = await Chat.findByPk(chat.id, { include: [{ model: Message, as: 'messages' }], transaction });

    expect(fetchedChat).toBeDefined();
    expect(fetchedChat!.messages).toHaveLength(1);
    expect(fetchedChat!.messages![0].message).toBe('Hello, world!');
    expect(fetchedChat!.messages![0].senderId).toBe(supplier.id);
    expect(fetchedChat!.messages![0].chatId).toBe(chat.id);
  });
});
