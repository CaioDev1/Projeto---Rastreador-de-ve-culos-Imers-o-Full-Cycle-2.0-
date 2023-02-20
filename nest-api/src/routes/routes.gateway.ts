import { Inject, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Producer } from '@nestjs/microservices/external/kafka.interface';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class RoutesGateway implements OnModuleInit {
  private kafkaProducer: Producer

  @WebSocketServer()
  server: Server

  constructor(
    @Inject('KAFKA_SERVICE') private kafkaClient: ClientKafka
  ) {}

  async onModuleInit() {
    this.kafkaProducer = await this.kafkaClient.connect()
  }

  @SubscribeMessage('new-direction')
  handleMessage(client: Socket, payload: {routeId: string}) {
    this.kafkaProducer.send({
      topic: 'route.new-direction',
      messages: [
        {
          key: 'route.new-direction',
          value: JSON.stringify({ routeId: payload.routeId, clientId: client.id})
        }
      ]
    }) 
    console.log(payload)
  }

  sendPosition() {
     
  }
}
