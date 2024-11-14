import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentIntentDto {
    @ApiProperty({ description: 'Monto a pagar en Dolares', example: 100 })
    amount: number;

    @ApiProperty({ description: 'Moneda para la transacción', example: 'usd' })
    currency: string;

    @ApiProperty({ description: 'Razón del pago', example: 'Pago por trabajo realizado' })
    reason: string;

    @ApiProperty({ description: 'ID del PostedJob', example: 'b31f1074-07d9-4b6d-ac1b-97fc86ac9f0d' })
    postedJobId: string;

    @ApiProperty({ description: 'ID del cliente',   example: 'b31f1074-07d9-4b6d-ac1b-97fc86ac9f0d' })
    clientId: string;

    @ApiProperty({ description: 'ID del profesional',   example: 'b31f1074-07d9-4b6d-ac1b-97fc86ac9f0d' })
    professionalId: string;
}
