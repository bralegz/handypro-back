import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Review {
    @PrimaryGeneratedColumn('uuid')
    review_id: string;

    @Column('decimal', { precision: 10, scale: 2, nullable: false })
    rating: number;

    @Column('varchar', { length: 50, nullable: false })
    comment: string;
}
