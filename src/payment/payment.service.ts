// payment.service.ts
import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-09-30.acacia',
    });
  }

  async createPaymentIntent(amount: number, currency: string) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount,
      currency,
    });

    return {
      clientSecret: paymentIntent.client_secret, // Asegúrate de que estás utilizando el campo correcto
    };
  }
}
