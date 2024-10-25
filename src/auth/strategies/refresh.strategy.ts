import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthJwtPayload } from '../types/auth.jwtPayload';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import refreshJwtConfig from '../config/refresh-jwt.config';
import { Request } from 'express';
import { AuthService } from '../auth.service';

//this is the same as the jwt strategy but we are using a different secret
@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
    Strategy,
    'refresh-jwt',
) {
    constructor(
        @Inject(refreshJwtConfig.KEY) // this is the name specified in the registerAs function in the configuration file
        private refreshJwtConfiguration: ConfigType<typeof refreshJwtConfig>,
        private authService: AuthService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: refreshJwtConfiguration.secret, //we are passing the refresh jwt secret
            ignoreExpiration: false,
            passReqToCallback: true,
        });
    }

    //if the refresh token is in the headers and is valid, not expired. This strategy it will call the validate function and pass the decoded payload coming from the decoded refresh. This will be attached to Request.user.
    async validate(req: Request, payload: AuthJwtPayload) {
        //This strategy validates the refresh token
        //Extract the refresh token
        const refreshToken = req
            .get('authorization')
            .replace('Bearer', '')
            .trim();

        const userId = payload.userId;

        //The returned value will be appended to the Req.user
        return await this.authService.validateRefreshToken(
            userId,
            refreshToken,
        );
    }
}
