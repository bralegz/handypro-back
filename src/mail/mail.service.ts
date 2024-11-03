import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { SignupUserDto } from '../user/dtos/signupUser.dto';
import { PostedJob } from 'src/postedJob/postedJob.entity';
import { User } from 'src/user/user.entity';
import { Application } from 'src/application/application.entity';
import { Review } from 'src/review/review.entity';
import { ApplicationStatusEnum } from 'src/application/enums/applicationStatus.enum';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) {}

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
            const client = postedJob?.client;
            await this.mailerService.sendMail({
                to: client.email,
                subject: 'Nueva Postulación para tu Publicación',
                template: './applicationReceived',
                context: {
                    name: client.fullname,
                    professionalName: professional.fullname,
                    jobTitle: postedJob.title,
                    postedJobUrl: `https://handypro.com/posted-jobs/clients/${client.id}`,
                },
            });

            console.log(`Email sent successfully to ${client.email}`);
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }

    public async bannedUser(user: Partial<User>): Promise<void> {
        try {
            await this.mailerService.sendMail({
                to: user.email,
                subject: 'Notificación de suspensión de cuenta en HandyPro',
                template: './bannedUser',
                context: {
                    name: user.fullname,
                    contactUrl: 'https://handypro.com/contact',
                },
            });
            console.log(`Email sent successfully to ${user.email}`);
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }

    public async jobCompleted(postedJob: Partial<PostedJob>){
        try {
            const user = postedJob.client
            await this.mailerService.sendMail({
                to: user.email,
                subject: '¡Tu trabajo ha sido completado en HandyPro!',
                template: './jobCompleted',
                context: {
                    name: user.fullname,
                    jobTitle: postedJob.title,
                    feedbackUrl: 'https://handypro.com/feedback',
                    contactUrl: 'https://handypro.com/contact',
                },
            });

            console.log(`Email sent successfully to ${user.email}`);
        } catch (error) {
            console.error('Error sending email:', error);
        }
        
    }

    public async reviewReceived(review: Partial<Review>, postedJob: Partial<PostedJob>){
        try {
            const professional = postedJob.applications.filter((app) => app.status === ApplicationStatusEnum.ACCEPTED).map(app => app.professional)
            const client = postedJob.client

            await this.mailerService.sendMail({
                to: professional.map(prof => prof.email),
                subject: '¡Nueva reseña de un cliente en HandyPro!',
                template: './reviewReceived',
                context: {
                    professionalName: professional.map(prof => prof.fullname),
                    clientName: client.fullname,
                    jobTitle: postedJob.title,
                    jobUrl: `https://handypro.com/posted-jobs/professional/${professional.map(prof => prof.id)}`,
                    contactUrl: 'https://handypro.com/contact',
                },
            });

            // console.log(`Email sent successfully to ${professional.email}`);
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }
}
