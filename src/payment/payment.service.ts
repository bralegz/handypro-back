import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './payment.entity';
import { PostedJob } from 'src/postedJob/postedJob.entity';
import { User } from 'src/user/user.entity';

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
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
    };
  }

  async handlePaymentSuccess(paymentIntent: any) {
    const { metadata, amount, currency, id } = paymentIntent;

    const client = await this.userRepository.findOne({ where: { id: metadata.clientId } });
    const professional = await this.userRepository.findOne({ where: { id: metadata.professionalId } });
    const postedJob = await this.postedJobRepository.findOne({ where: { id: metadata.postedJobId } });

    if (client && professional && postedJob) {
      const payment = this.paymentRepository.create({
        id,
        amount: amount / 100, 
        currency,
        status: 'completado',
        reason: metadata.reason,
        client,
        professional,
        postedJob,
      });

      await this.paymentRepository.save(payment);

      postedJob.status = 'completado';
      await this.postedJobRepository.save(postedJob);
    }
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



// payment.service.ts
// import { Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { Payment } from './payment.entity';
// import { PostedJob } from 'src/postedJob/postedJob.entity';

// @Injectable()
// export class PaymentService {
 
//   constructor(
//     @InjectRepository(Payment)
//     private readonly paymentRepository: Repository<Payment>,
//     @InjectRepository(PostedJob)
//     private readonly postedJobRepository: Repository<PostedJob>,
//   ) {}


//   async getPayments() {
//     return await this.paymentRepository.find(
//         { relations: ['client', 'professional', 'postedJob'] }
//     );
//   }

//   async createPaymentIntent(amount: number, currency: string, reason: string, postedJobId: string, clientId: string, professionalId: string) {
//     // Creación del Payment Intent y guardado en la base de datos
//     const payment = this.paymentRepository.create({
//       amount,
//       currency,
//       status: 'pendiente',
//       reason,
//       client: { id: clientId } as any,
//       professional: { id: professionalId } as any,
//       postedJob: { id: postedJobId } as any,
//     });
//     await this.paymentRepository.save(payment);
//     return payment;
//   }

//   async handlePaymentSuccess(paymentId: string) {
//     const payment = await this.paymentRepository.findOne({ where: { id: paymentId }, relations: ['postedJob'] });
//     if (payment) {
//       payment.status = 'completado';
//       await this.paymentRepository.save(payment);

//       // Cambia el estado del PostedJob asociado a 'completado'
//       const postedJob = payment.postedJob;
//       if (postedJob) {
//         postedJob.status = 'completado';
//         await this.postedJobRepository.save(postedJob);
//       }
//     }
//   }

//   async updatePaymentStatus(paymentId: string, status: string) {
//     const payment = await this.paymentRepository.findOne({ where: { id: paymentId } });
//     if (payment) {
//       payment.status = status;
//       await this.paymentRepository.save(payment);
//     }
//   }
// }

// payment.service.ts
// import { Injectable } from '@nestjs/common';
// import Stripe from 'stripe';

// @Injectable()
// export class PaymentService {
//   private stripe: Stripe;

//   constructor() {
//     this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
//       apiVersion: '2024-09-30.acacia',
//     });
//   }

//   async createPaymentIntent(amount: number, currency: string, postedJobId: string, clientId: string, professionalId: string) {
//     const paymentIntent = await this.stripe.paymentIntents.create({
//       amount,
//       currency,
//       metadata: {
//         postedJobId,
//         clientId,
//         professionalId,
//       },
//     });
  
//     return {
//       clientSecret: paymentIntent.client_secret,
//     };
//   }
  