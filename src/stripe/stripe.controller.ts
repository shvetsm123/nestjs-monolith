import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-payment-intent')
  createPaymentIntent(
    @Body('amount') amount: number,
    @Body('currency') currency: string,
  ) {
    return this.stripeService.createPaymentIntent(amount, currency);
  }

  @Get('payment-intent/:id')
  getPaymentIntent(@Param('id') paymentIntentId: string) {
    return this.stripeService.retrievePaymentIntent(paymentIntentId);
  }
}
