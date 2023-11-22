import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ConnectService } from './connect/connect.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly chatService: ConnectService) {}


  @Get()
  getStart(): any {
    const body = {
      "DisplayName":"JaredJHZ"
    }
    return this.chatService.createSession();
  }
}
