import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthJwtPayload } from '../types/auth.jwtPayload';
import { Inject, Injectable } from '@nestjs/common';
import refreshJwtConfig from '../config/refresh-jwt.config';

//this is the same as the jwt strategy but we are using a different secret
@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
    Strategy,
    'refresh-jwt',
) {
    constructor(
        @Inject(refreshJwtConfig.KEY) // this is the name specified in the registerAs function in the configuration file
        private refreshJwtConfiguration: ConfigType<typeof refreshJwtConfig>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: refreshJwtConfiguration.secret, //we are passing the refresh jwt secret
            ignoreExpiration: false,
        });
    }

    //if the refresh token is in the headers and is valid, not expired. This strategy it will call the validate function and pass the decoded payload coming from the decoded refresh. This will be attached to Request.user.
    validate(payload: AuthJwtPayload) {
        //This will be appended to the Req.user
        return {
            id: payload.userId,
            role: payload.userRole,
            email: payload.userEmail,
            fullname: payload.userName,
        };
    }
}
