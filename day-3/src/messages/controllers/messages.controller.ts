import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CreateMessageDto } from '../dtos/create-message.dto';

@Controller('messages')
export class MessagesController {

  @Get()
  listMessages() {
    return ''
  }

  @Post()
  createMessage(@Body() body: CreateMessageDto) {
    console.log(body);
  }

  @Get('/:id')
  getMessage(@Param('id') id: any) {
    console.log(id);
  }
}
