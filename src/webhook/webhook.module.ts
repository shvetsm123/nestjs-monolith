import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { OrderModule } from '../order/order.module';

@Module({
  controllers: [WebhookController],
  providers: [WebhookService],
  imports: [OrderModule],
})
export class WebhookModule {}
