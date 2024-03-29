import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import {ClientsModule, Transport} from "@nestjs/microservices";
import {PRODUCT_PACKAGE_NAME, PRODUCT_SERVICE_NAME} from "./proto/product.pb";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Order} from "./order.entity";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: PRODUCT_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          url: '0.0.0.0:50053',
          package: PRODUCT_PACKAGE_NAME,
          protoPath: 'node_modules/api-grpc-auth/proto/product.proto',
        },
      },
    ]),
    TypeOrmModule.forFeature([Order]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}