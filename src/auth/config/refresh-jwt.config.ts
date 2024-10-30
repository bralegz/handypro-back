import { registerAs } from '@nestjs/config';
import {  JwtSignOptions } from '@nestjs/jwt';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env' });

export default registerAs(
    'refresh-jwt',
    (): JwtSignOptions => ({
        secret: process.env.REFRESH_JWT_SECRET,
        expiresIn: process.env.REFRESH_JWT_EXPIRE_IN,
    }),
);
