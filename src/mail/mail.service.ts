import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { SignupUserDto } from '../user/dtos/signupUser.dto';
import { PostedJob } from 'src/postedJob/postedJob.entity';
import { User } from 'src/user/user.entity';

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
                subject: `Notificación de Nueva Postulación en ${postedJob.title}`,
                template: './applicationsReceived',
                context: {
                    name: client.fullname,
                    email: client.email,
                    jobTitle: postedJob.title,
                    professional_name: professional.fullname,
                    professional_categoty: professional.categories,
                    professional_rating: professional.rating,
                    professional_location: professional.location.name,
                    postedJobUrl: 'https://handypro.com/posted-jobs/clients/67523c64-3787-47f0-b27d-5c105f158188',
                },
            });

            console.log(`Email sent successfully to ${client.email}`);
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }

    public async prueba(email: string): Promise<void> {
        try {
            await this.mailerService.sendMail({
                to: email,
                subject: 'Recibió una postulación en su posteo publicado',
                template: './applicationsReceived',
                context: {
                    name: 'nahuel',
                    email: email,
                    jobTitle: 'postulacion',
                    postedJobUrl: 'https://handypro.com/prueba',
                },
            });

            console.log(`Email sent successfully`);
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }

    public async bannedUser(user: Partial<User>): Promise<void> {
        try {
            await this.mailerService.sendMail({
                to: user.email,
                subject: 'Notificación de Suspensión de Cuenta en HandyPro',
                template: './bannedUser',
                context: {
                    name: user.fullname,
                    email: user.email,
                    contactUrl: 'https://handypro.com/contacto',
                },
            });

            console.log(`Email sent successfully`);
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }
}
