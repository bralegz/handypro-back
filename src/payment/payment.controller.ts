import { Controller, Post, Body, Headers, HttpStatus, Get } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Stripe } from 'stripe';

@Controller('payment')
export class PaymentController {
  private stripe: Stripe;

  constructor(private readonly paymentService: PaymentService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-09-30.acacia',
    });
  }

  @Get()
  async getPayments() {
    return await this.paymentService.getPayments();
  }

  @Post('create-payment-intent')
  async createPaymentIntent(@Body() body: { amount: number; currency: string, reason: string, postedJobId: string, clientId: string, professionalId: string }) {
    const { amount, currency, reason, postedJobId, clientId, professionalId } = body;
    
    const paymentIntent = await this.paymentService.createPaymentIntent(amount, currency, reason, postedJobId, clientId, professionalId);
    return paymentIntent;
  }

  @Post('webhook')
  async handleWebhook(@Body() payload: any, @Headers('stripe-signature') signature: string) {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;
    try {
      event = this.stripe.webhooks.constructEvent(payload, signature, endpointSecret);
    } catch (err) {
      console.error(`Webhook Error: ${err.message}`);
      return { status: HttpStatus.BAD_REQUEST };
    }

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const paymentId = paymentIntent.id;

      await this.paymentService.handlePaymentSuccess(paymentIntent);
    } else if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object;
      const paymentId = paymentIntent.id;

      await this.paymentService.updatePaymentStatus(paymentId, 'fallido');
    }

    return { received: true };
  }
}
