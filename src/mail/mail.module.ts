import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { strict } from 'assert';

@Global() //You can user the MailService withoutn importing the MailModule in other modules because now its now global.
@Module({
    imports: [
        MailerModule.forRootAsync({
            inject: [ConfigService], //ConfigService allows you to access the configuration values
            useFactory: async (config: ConfigService) => ({
                transport: {
                    host: config.get('mail.mailHost'),
                    secure: false,
                    port: 2525,
                    auth: {
                        user: config.get('mail.smtpUsername'),
                        pass: config.get('mail.smtpPassword'),
                    },
                },
                defaults: {
                    from: `HandyPro <no-reply@handypro.com>`,
                },
                template: {
                    dir: join(__dirname, 'templates'),
                    adapter: new EjsAdapter({ inlineCssEnabled: true }),
                    options: {
                        strict: false,
                    },
                },
            }),
        }),
    ],
    providers: [MailService],
    exports: [MailService], //export mail service so can be used inside other modules
})
export class MailModule {}
