import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Review {
    @PrimaryGeneratedColumn('uuid')
    review_id: string;

    @Column('uuid', { nullable: false })
    professional_id: string; // FK

    @Column('decimal', { precision: 10, scale: 2, nullable: false })
    rating: number;

    @Column('varchar', { length: 50, nullable: false })
    comment: string;

    // Faltan las relaciones
}
