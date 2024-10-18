import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('reviews')
export class Reviews {
    @PrimaryGeneratedColumn('uuid')
    review_id: string;

    @Column('uuid', { nullable: false })
    professional_id: string;

    @Column('uuid', { nullable: false })
    user_id: string;

    @Column('decimal', { precision: 10, scale: 2, nullable: false })
    rating: number;

    @Column('varchar', { length: 50, nullable: false })
    comment: string;

    // Faltan las relaciones
}
