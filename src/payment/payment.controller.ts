import {
    Controller,
    Post,
    Body,
    Headers,
    HttpStatus,
    Get,
    Req,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Stripe } from 'stripe';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePaymentIntentDto } from './dto/payment.dto';

@ApiTags('payment')
@Controller('payment')
export class PaymentController {
    private stripe: Stripe;

    constructor(private readonly paymentService: PaymentService) {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2024-09-30.acacia',
        });
    }

    @Get()
    @ApiOperation({ summary: 'Obtener todos los pagos' })
    @ApiResponse({
        status: 200,
        description: 'Lista de pagos obtenida exitosamente',
    })
    async getPayments() {
        return await this.paymentService.getPayments();
    }

    @Post('create-payment-intent')
    @ApiOperation({ summary: 'Crear un pago con Stripe' })
    @ApiResponse({
        status: 201,
        description: 'Pago creado exitosamente',
    })
    @ApiResponse({
        status: 400,
        description: 'Error al crear el Pago',
    })
    @ApiBody({
        description: 'Datos necesarios para crear un Pago',
        type: CreatePaymentIntentDto, 
    })
    async createPaymentIntent(
        @Body()
        body: {
            amount: number;
            currency: string;
            reason: string;
            postedJobId: string;
            clientId: string;
            professionalId: string;
        },
    ) {
        const {
            amount,
            currency,
            reason,
            postedJobId,
            clientId,
            professionalId,
        } = body;

        const paymentIntent = await this.paymentService.createPaymentIntent(
            amount,
            currency,
            reason,
            postedJobId,
            clientId,
            professionalId,
        );
        return paymentIntent;
    }

    @Post('webhook')
    async handleWebhook(
        @Req() req,
        @Headers('stripe-signature') signature: string,
    ) {
      console.log('Webhook received'); 
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
        let event;

        try {
            event = this.stripe.webhooks.constructEvent(
                req.rawBody,
                signature,
                endpointSecret,
            );
            console.log('Webhook recibido:', event.type); // Log inicial para verificar la recepción
        } catch (err) {
            console.error(`Webhook Error: ${err.message}`);
            return { status: HttpStatus.BAD_REQUEST };
        }

        if (event.type === 'payment_intent.succeeded') {
            const paymentIntent = event.data.object;
            const paymentId = paymentIntent.id;

            console.log(`Pago exitoso recibido para Payment ID: ${paymentId}`);
            console.log('Metadata recibida:', paymentIntent.metadata);

            await this.paymentService.handlePaymentSuccess({
                paymentId, 
                status: 'completado',
                reason: paymentIntent.metadata.reason,
                postedJobId: paymentIntent.metadata.postedJobId,
                clientId: paymentIntent.metadata.clientId,
                professionalId: paymentIntent.metadata.professionalId,
                amount: paymentIntent.amount_received,
            });

            console.log(
                `Payment ${paymentId} guardado correctamente en la base de datos.`,
            );
        } else if (event.type === 'payment_intent.payment_failed') {
            const paymentIntent = event.data.object;
            const paymentId = paymentIntent.id;

            console.log(`Pago fallido para Payment ID: ${paymentId}`);

            await this.paymentService.updatePaymentStatus(paymentId, 'fallido');
            console.log(
                `Estado del Payment ${paymentId} actualizado a 'fallido'.`,
            );
        }

        return { received: true };
    }
}
