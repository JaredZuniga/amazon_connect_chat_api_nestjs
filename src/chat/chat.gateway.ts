import {
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection{

  afterInit(server: Server) {
    console.log('Initialized');
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client Disconnected: ${client.id}`);
  }

  async handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client Connected: ${client.id}`);
  }
  @WebSocketServer()
  server: Server;
  // listen for send_message events
  @SubscribeMessage('send_message')
  listenForMessages(@MessageBody() message: string) {
    this.server.sockets.emit('receive_message', message);
  }
}