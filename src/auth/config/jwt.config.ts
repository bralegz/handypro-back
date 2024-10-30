import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env' });

export default registerAs(
    'jwt',
    (): JwtModuleOptions => ({
        secret: process.env.JWT_SECRET,
        signOptions: {
            expiresIn: process.env.JWT_EXPIRE_IN,
        },
    }),
);
