import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import googleOauthConfig from '../config/google-oauth.config';
import { ConfigType } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject(googleOauthConfig.KEY)
        private googleConfiguration: ConfigType<typeof googleOauthConfig>,
        private authService: AuthService,
    ) {
        super({
            clientID: googleConfiguration.clientID,
            clientSecret: googleConfiguration.clientSecret,
            callbackURL: googleConfiguration.callbackURL,
            scope: ['email', 'profile'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: VerifyCallback,
    ) {
        //Check in the database if this user exists. If its not there means that the user is logging for the first time and we need to insert it into our user table.
        //Otherwise we will just retreive the data from the database and return it in this function and it will be appended to the Req.user.

        console.log({ profile });
        const user = await this.authService.validateGoogleUser({
            email: profile.emails[0].value,
            fullname: profile.displayName,
            password: '',
            confirmationPassword: '',
            profileImg: profile.photos[0].value,
        });

        //first argument error object - second argument user data
        //append user to request object
        done(null, { ...user, role: '' });
    }
}
