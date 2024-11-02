import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { SignupUserDto } from '../user/dtos/signupUser.dto';
import { PostedJob } from 'src/postedJob/postedJob.entity';

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

    public async sendApplicationrReceived(postedJob: Partial<PostedJob>): Promise<void> {
        try {
            const client = postedJob?.client;
            await this.mailerService.sendMail({
                to: client.email,
                subject: 'Recibió una postulación en su posteo publicado',
                template: './applicationsReceived',
                context: {
                    name: client.fullname,
                    email: client.email,
                    jobTitle: postedJob.title,
                    postedJobUrl: 'https://handypro.com/posted-jobs/clients/67523c64-3787-47f0-b27d-5c105f158188',
                },
            });

            console.log(`Email sent successfully to ${client.email}`);
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }

   
}
