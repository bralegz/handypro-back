// payment.controller.ts
import { Controller, Post, Body, Headers, HttpStatus } from '@nestjs/common';
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

  @Post('create-payment-intent')
  async createPaymentIntent(@Body() body: { amount: number; currency: string }) {

    console.log('Request body:', body); // Log del cuerpo de la solicitud
    const { amount, currency } = body;

    // Llama al servicio para crear el PaymentIntent
    const paymentIntent = await this.paymentService.createPaymentIntent(amount, currency);

    // Devuelve el clientSecret al frontend
    return paymentIntent;
  }
  @Post('webhook')
  async handleWebhook(@Body() payload: any, @Headers('stripe-signature') signature: string) {
    console.log('Received webhook request'); // Log de llegada al endpoint
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  
    let event;
    console.log('Webhook payload:', payload); // Log del payload recibido
    console.log('Stripe Signature:', signature); // Log de la firma recibida
  
    try {
      event = this.stripe.webhooks.constructEvent(payload, signature, endpointSecret);
      console.log('Event constructed successfully:', event);
    } catch (err) {
      console.error(`Webhook Error: ${err.message}`);
      return { status: HttpStatus.BAD_REQUEST };
    }
  
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      console.log('PaymentIntent was successful!', paymentIntent);
    } else {
      console.log(`Unhandled event type: ${event.type}`); // Log de tipo de evento no manejado
    }
  
    return { received: true };
  }
  

}
