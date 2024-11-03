import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Review {
    @PrimaryGeneratedColumn('uuid')
    review_id: string;

    @Column('decimal', { precision: 10, scale: 1, nullable: false })
    rating: number;

    @Column('varchar', { length: 255, nullable: false })
    comment: string;

    @Column({ type: 'boolean', default: true })
    is_active: boolean;

    @CreateDateColumn({type: 'timestamp'})
    created_at: Date;
}
