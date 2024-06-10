import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import Message from './Message';

class Chat extends Model {
  public id!: number;
  public supplierId!: number;
  public customerId!: number;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public messages?: Message[];
}

Chat.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    supplierId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  {
    tableName: 'chats',
    sequelize,
  }
);

// Associations
Chat.hasMany(Message, {
  sourceKey: 'id',
  foreignKey: 'chatId',
  as: 'messages',
});

Message.belongsTo(Chat, {
  foreignKey: 'chatId',
  as: 'chat',
});

export default Chat;
