import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePostedJobDto {
    @ApiProperty({ example: 'La bañera se rompió' })
    @IsString()
    title: string;
    @ApiProperty({ example: 'No me he bañado en 20 dias' })
    @IsString()
    description: string;

    @ApiProperty({ example: 'La Molina' })
    @IsString()
    location: string;

    @ApiProperty({ example: 'alta' })
    @IsString()
    priority: string;

    @ApiProperty({ example: 'Plomero' })
    @IsString()
    category: string;

    @ApiProperty({ example: 'https://www.google.com/img/1221212' })
    @IsString()
    photo: string;
}
