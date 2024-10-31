import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { SignupUserDto } from '../user/dtos/signupUser.dto';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) {}

    public async sendUserWelcome(user: SignupUserDto): Promise<void> {
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
    }
}
