import { Controller, Post, Headers, Request } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { RawBodyRequest } from '@nestjs/common/interfaces';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post('stripe')
  handleStripeWebhook(
    @Request() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') sig: string,
  ) {
    const payload = req.rawBody;
    return this.webhookService.handleStripeWebhook(payload, sig);
  }
}
