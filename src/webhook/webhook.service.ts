import { Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { OrderService } from '../order/order.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WebhookService {
  constructor(
    @Inject('STRIPE_CLIENT') private readonly stripe: Stripe,
    private readonly orderService: OrderService,
    private readonly configService: ConfigService,
  ) {}

  async handleStripeWebhook(payload: any, sig: string) {
    const endpointSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');

    const event: Stripe.Event = this.stripe.webhooks.constructEvent(
      payload,
      sig,
      endpointSecret,
    );

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const paymentIntentId = paymentIntent.id;
        await this.orderService.updatePaymentStatus(paymentIntentId, true);
        break;
      case 'payment_intent.payment_failed':
        console.log('payment intent failed');
        break;
      default:
    }

    return { received: true };
  }
}
