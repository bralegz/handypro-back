import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('postedJobs')
export class PostedJobs {
    @PrimaryGeneratedColumn('uuid')
    postedJobs_id: string;

    @Column('uuid', { nullable: false })
    user_id: string;

    @Column('uuid', { default: null })
    professional_id: string;

    @Column('uuid', { default: null })
    review_id: string;

    @Column('varchar', { length: 30, nullable: false })
    requested_professional: string;

    @Column('varchar', { length: 50, nullable: false })
    description: string;

    @Column('varchar', { length: 50, nullable: false })
    location: string;

    @Column('date', { nullable: false })
    requested_date: string;

    @Column('varchar', { length: 20, nullable: false })
    priority: string;

    @Column('array', { array: true, nullable: false })
    job_photos: string[];

    @Column('varchar', { length: 15, default: 'pendiente' })
    status: string;

    // Faltan las relaciones
}
