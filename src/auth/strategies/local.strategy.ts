import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        //if your passowrd property is called password you can skip it int he super method but if its named differently like ´pass'then you'd need to rename it like -> password: 'pass'
        super({
            usernameField: 'email',
        });
    }

    validate(email: string, password: string) {
        // The returned object will be appended to the Request object under the name user. (Request.user)
        if(password === '') {
            throw new UnauthorizedException('Password no puede estar vacio')
        }
        return this.authService.validateUser(email, password);
    }
}
