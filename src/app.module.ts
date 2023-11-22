import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatGateway } from './chat/chat.gateway';
import { ConnectService } from './connect/connect.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, ChatGateway, ConnectService],
})
export class AppModule {}
