import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
    @ApiProperty({ example: 'diego.sanchez@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'password' })
    @IsString()
    password: string;
}
