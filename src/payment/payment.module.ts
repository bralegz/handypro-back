
import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import Stripe from 'stripe';
import { config as dotenvConfig } from 'dotenv';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './payment.entity';
import { PostedJobModule } from 'src/postedJob/postedJob.module';

dotenvConfig({ path: '.env' });

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]), 
    PostedJobModule,
  ],
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
  exports: ['STRIPE', TypeOrmModule],
})
export class PaymentModule {}