import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {INestMicroservice, ValidationPipe} from "@nestjs/common";
import {Transport} from "@nestjs/microservices";
import {protobufPackage} from "./order/proto/order.pb";

async function bootstrap() {
  const app: INestMicroservice = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.GRPC,
    options: {
      url: '0.0.0.0:50052',
      package: protobufPackage,
      protoPath: ('node_modules/api-grpc-auth/proto/order.proto'),
    },
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen();
}
bootstrap();
