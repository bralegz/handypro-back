import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import jwtConfig from '../config/jwt.config';
import { AuthJwtPayload } from '../types/auth.jwtPayload';
import { Inject, Injectable } from '@nestjs/common';

//This strategy is responsible for extracting the JWT from the incoming requests headers and check if the jwt is valid
//If that is the case, it will let the user to access the endpoints
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject(jwtConfig.KEY)
        private jwtConfiguration: ConfigType<typeof jwtConfig>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // it will expect the jwt inside the headers as a bearer token
            secretOrKey: jwtConfiguration.secret, // provide the secret key for decoding the jwt
            ignoreExpiration: false,
        });
    }

    //it just receives the decoded payload from the jwt. The jwt was already validated by the JwtStrategy at this point.
    // We will need to extract the userId from the payload to protect our routes.
    validate(payload: AuthJwtPayload) {
        return { id: payload.userId }; //This will be appended to Request.user
    }
}
