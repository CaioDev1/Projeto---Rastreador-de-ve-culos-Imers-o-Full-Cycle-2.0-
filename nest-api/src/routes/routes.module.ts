import { Module } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { RoutesController } from './routes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Route, RouteSchema } from './entities/route.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Route.name, schema: RouteSchema }]),
    ClientsModule.registerAsync([ //? Assíncrono pra esperar a injeção do ConfigModule (AppModule) para leitura das variáveis de ambiente
      {
        name: 'KAFKA_SERVICE',
        useFactory: () => {
          return {
            transport: Transport.KAFKA,
            options: {
              client: {
                clientId: process.env.KAFKA_CLIENT_ID,
                brokers: [process.env.KAFKA_BROKER]
              },
              consumer: {
                groupId: //? Recomendado nome aleatório
                  !process.env.KAFKA_CONSUMER_GROUP_ID ||
                  process.env.KAFKA_CONSUMER_GROUP_ID === ''
                    ? 'my-consumer-' + Math.random()
                    : process.env.KAFKA_CONSUMER_GROUP_ID,
              }
            }
          }
        }
      }
    ])
  ],
  controllers: [RoutesController],
  providers: [RoutesService],
})
export class RoutesModule {}
