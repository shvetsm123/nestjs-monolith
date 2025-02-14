import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chat } from './schemas/chat.schema';
import { Model } from 'mongoose';
import { ChatDto } from './dto/chat.dto';

@Injectable()
export class ChatService {
  constructor(@InjectModel(Chat.name) private chatModel: Model<Chat>) {}

  async sendMessage(chatDto: ChatDto) {
    const chatMessage = new this.chatModel(chatDto);
    return chatMessage.save();
  }

  async getMessages(senderId: string, receiverId: string) {
    return this.chatModel
      .find({
        $or: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      })
      .sort({ createdAt: 1 });
  }
}
