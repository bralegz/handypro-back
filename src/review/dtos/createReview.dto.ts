import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateReview {
    @ApiProperty({
        description: 'El rating debe ser un numero con un decimal como maximo',
        example: 4.5,
    })
    @IsNotEmpty()
    @IsNumber()
    rating: number;

    @ApiProperty({
        description: 'El comentario debe ser un string',
        example: 'Muy buen trabajo instalando una cañeria',
    })
    @IsNotEmpty()
    @IsString()
    comment: string;
}
