import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { SignupUserDto } from '../user/dtos/signupUser.dto';
import { PostedJob } from 'src/postedJob/postedJob.entity';
import { User } from 'src/user/user.entity';
import { Application } from 'src/application/application.entity';
import { Review } from 'src/review/review.entity';
import { ApplicationStatusEnum } from 'src/application/enums/applicationStatus.enum';
import { Payment } from 'src/payment/payment.entity';
import { PostedJobStatusEnum } from 'src/postedJob/enums/postedJobStatus.enum';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) {}

    //SEND MAIL WHEN USEER IS CREATED
    public async sendUserWelcome(user: SignupUserDto): Promise<void> {
        try {
            await this.mailerService.sendMail({
                to: user.email,
                subject: 'Welcome to HandyPro',
                template: './welcome',
                context: {
                    name: user.fullname,
                    email: user.email,
                    loginUrl: 'https://handypro.com/login',
                },
            });
            console.log('Email sent successfully');
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }

    public async sendApplicationrReceived(postedJob: Partial<PostedJob>, professional: Partial<User>): Promise<void> {
        try {
            const client = postedJob.client;

            await this.mailerService.sendMail({
                to: client.email,
                subject: 'Nueva Postulación Recibida para tu trabajo',
                template: './applicationReceived',
                context: {
                    name: client.fullname,
                    jobTitle: postedJob.title,
                    professionalName: professional.fullname,
                    postedJobUrl: `https://handypro.com/job/${postedJob.id}`,
                },
            });

            console.log(`Email sent successfully to ${client.email}`);
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }

    public async jobCompleted(postedJob: Partial<PostedJob>) {
        try {
            const user = postedJob.client;

            await this.mailerService.sendMail({
                to: user.email,
                subject: '¡Tu trabajo ha sido completado en HandyPro! ¡Pago pendiente!',
                template: './jobCompleted',
                context: {
                    name: user.fullname,
                    jobTitle: postedJob.title,
                    paymentUrl: 'https://handypro.com/create-payment-intent',
                    contactUrl: 'https://handypro.com/contact',
                },
            });

            console.log(`Email sent successfully to ${user.email}`);
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }

    //SEND MAIL WHEN REVIEW IS POSTED
    public async reviewReceived(postedJob: Partial<PostedJob>) {
        try {
            const professional = postedJob.applications.filter((app) => app.status === ApplicationStatusEnum.ACCEPTED).map((app) => app.professional);
            const client = postedJob.client;

            await this.mailerService.sendMail({
                to: professional.map((prof) => prof.email),
                subject: '¡Nueva reseña de un cliente en HandyPro!',
                template: './reviewReceived',
                context: {
                    professionalName: professional.map((prof) => prof.fullname),
                    clientName: client.fullname,
                    jobTitle: postedJob.title,
                    jobUrl: `https://handypro.com/posted-jobs/${postedJob.id}`,
                    contactUrl: 'https://handypro.com/contact',
                },
            });

            console.log(`Email sent successfully to ${professional.map((prof) => prof.id)}`);
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }

    public async paymentConfirmed(payment: Partial<Payment>) {
        try {
            const client = payment.client;
            const professional = payment.professional;
            const postedJob = payment.postedJob;

            await this.mailerService.sendMail({
                to: client.email,
                subject: 'Confirmación de Pago Recibido en HandyPro',
                template: './paymentConfirmed',
                context: {
                    clientName: client.fullname,
                    jobTitle: postedJob.title,
                    paymentAmount: payment.amount,
                    professionalName: professional.fullname,
                    jobUrl: `https://handypro.com/posted-jobs/${postedJob.id}`,
                    contactUrl: 'https://handypro.com/contact',
                },
            });

            console.log(`Email sent successfully to ${client.email}`);
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }

    // public async prueba(email: string): Promise<void> {
    //     try {
    //         await this.mailerService.sendMail({
    //             to: email,
    //             subject: 'Recibió una postulación en su posteo publicado',
    //             template: './applicationsReceived',
    //             context: {
    //                 name: 'nahuel',
    //                 email: email,
    //                 jobTitle: 'postulacion',
    //                 postedJobUrl: 'https://handypro.com/prueba',
    //             },
    //         });

    //         console.log(`Email sent successfully`);
    //     } catch (error) {
    //         console.error('Error sending email:', error);
    //     }
    // }

    public async bannedUser(user: Partial<User>) {
        try {
            await this.mailerService.sendMail({
                to: user.email,
                subject: 'Notificación de Suspensión de Cuenta en HandyPro',
                template: './bannedUser',
                context: {
                    name: user.fullname,
                    contactUrl: 'https://handypro.com/contacto',
                },
            });

            console.log(`Email sent successfully`);
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }

    public async userUnbanned(user: Partial<User>) {
        try {
            await this.mailerService.sendMail({
                to: user.email,
                subject: 'Notificación de Rehabilitación de Cuenta en HandyPro',
                template: './unbannedUser',
                context: {
                    name: user.fullname,
                    contactUrl: 'https://handypro.com/contacto',
                },
            });

            console.log(`Email sent successfully`);
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }

    public async deleteReview(postedJob: Partial<PostedJob>) {
        try {
            const client = postedJob.client;

            await this.mailerService.sendMail({
                to: client.email,
                subject: 'Notificación de eliminación de reseña en HandyPro',
                template: './deleteReview',
                context: {
                    clientName: client.fullname,
                    jobTitle: postedJob.title,
                    reason: 'Su reseña fue eliminada debido a violaciones de nuestras políticas.',
                    contactUrl: 'https://handypro.com/contact',
                },
            });

            console.log(`Email sent successfully to ${client.email}`);
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }
}
