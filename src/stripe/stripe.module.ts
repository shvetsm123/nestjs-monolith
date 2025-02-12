import { Global, Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Global()
@Module({
  imports: [],
  providers: [
    {
      provide: 'STRIPE_CLIENT',
      useFactory: (configService: ConfigService) => {
        return new Stripe(configService.get('STRIPE_SECRET_KEY'), {
          apiVersion: '2025-01-27.acacia',
        });
      },
      inject: [ConfigService],
    },
    StripeService,
  ],
  exports: ['STRIPE_CLIENT'],
  controllers: [StripeController],
})
export class StripeModule {}
