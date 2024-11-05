import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './payment.entity';
import { PostedJob } from 'src/postedJob/postedJob.entity';
import { User } from 'src/user/user.entity';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class PaymentService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(PostedJob)
    private readonly postedJobRepository: Repository<PostedJob>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailService: MailService,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-09-30.acacia',
    });
  }

  async createPaymentIntent(amount: number, currency: string, reason: string, postedJobId: string, clientId: string, professionalId: string) {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount,
      currency,
      metadata: {
        postedJobId,
        clientId,
        professionalId,
        reason,
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
    };
  }

  async handlePaymentSuccess({
    paymentId,
    amount,
    reason,
    status,
    postedJobId,
    clientId,
    professionalId,
}: {
    paymentId: string;
    amount: number;
    status: string;
    reason: string;
    postedJobId: string;
    clientId: string;
    professionalId: string;
}) {
    console.log(`Iniciando proceso de guardado para Payment ID: ${paymentId}...`);

    if (!clientId || !professionalId || !postedJobId) {
        console.error('Error: Metadata incompleta.');
        return;
    }

    const client = await this.userRepository.findOne({ where: { id: clientId } });
    const professional = await this.userRepository.findOne({ where: { id: professionalId } });
    const postedJob = await this.postedJobRepository.findOne({ where: { id: postedJobId } });

    if (!client || !professional || !postedJob) {
        console.error('Error: Cliente, profesional o trabajo no encontrados en la base de datos.');
        return;
    }

    const payment = this.paymentRepository.create({
        amount: amount,
        currency: 'usd', 
        status,
        reason,
        client,
        professional,
        postedJob,
    });

    await this.paymentRepository.save(payment);

    postedJob.status = 'completado';
    await this.postedJobRepository.save(postedJob);

    await this.mailService.paymentConfirmed(payment)

    console.log(`Payment ID: ${paymentId} guardado exitosamente.`);
}

  async updatePaymentStatus(paymentId: string, status: string) {
    const payment = await this.paymentRepository.findOne({ where: { id: paymentId } });
    if (payment) {
      payment.status = status;
      await this.paymentRepository.save(payment);
    }
  }

  async getPayments() {
    return await this.paymentRepository.find({ relations: ['client', 'professional', 'postedJob'] });
  }
}

