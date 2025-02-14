import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatDto } from './dto/chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('send')
  sendMessage(@Body() chatDto: ChatDto) {
    return this.chatService.sendMessage(chatDto);
  }

  @Get(':senderId/:receiverId/messages')
  getMessages(
    @Param('senderId') senderId: string,
    @Param('receiverId') receiverId: string,
  ) {
    return this.chatService.getMessages(senderId, receiverId);
  }
}
