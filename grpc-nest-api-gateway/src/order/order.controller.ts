import {Controller, Inject, OnModuleInit, Post, Req, UseGuards} from '@nestjs/common';
import {CreateOrderResponse, ORDER_SERVICE_NAME, OrderServiceClient, CreateOrderRequest} from "./order.pb";
import {ClientGrpc} from "@nestjs/microservices";
import {AuthGuard} from "../auth/auth.guard";
import {Observable} from "rxjs";
import { Request } from 'express';

@Controller('order')
export class OrderController implements OnModuleInit {
    private svc: OrderServiceClient;

    @Inject(ORDER_SERVICE_NAME)
    private readonly client: ClientGrpc;

    public onModuleInit(): void {
        this.svc = this.client.getService<OrderServiceClient>(ORDER_SERVICE_NAME);
    }

    @Post()
    @UseGuards(AuthGuard)
    private async createOrder(@Req() req: Request): Promise<Observable<CreateOrderResponse>> {
        const body: CreateOrderRequest = req.body;

        body.userId = <number>req.user;

        return this.svc.createOrder(body);
    }
}