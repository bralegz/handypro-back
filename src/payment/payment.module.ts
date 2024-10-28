import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import Stripe from 'stripe';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env' });

@Module({
  controllers: [PaymentController],
  providers: [
    PaymentService,
    {
      provide: 'STRIPE',
      useFactory: () => {
        return new Stripe(process.env.STRIPE_SECRET_KEY, {
          apiVersion: '2024-09-30.acacia', 
        });
      },
    },
  ],
  exports: ['STRIPE'],
})
export class PaymentModule {}
