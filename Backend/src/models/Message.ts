import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import User from './User';
import Chat from './Chat';

class Message extends Model {
  public id!: number;
  public chatId!: number;
  public senderId!: number;
  public message!: string;
  
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Message.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    chatId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Chat,
        key: 'id',
      },
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: 'messages',
    sequelize,
  }
);

export default Message;
