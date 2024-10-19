import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('postedJobs')
export class PostedJobs {
    @PrimaryGeneratedColumn('uuid')
    posted_jobs_id: string;

    @Column('uuid', { default: null })
    client_id: string; // FK

    @Column('uuid', { default: null })
    professional_id: string; // FK

    @Column('uuid', { default: null })
    review_id: string; // FK

    @Column('uuid', { default: null })
    category_id: string; // FK

    @Column('varchar', { length: 30, nullable: false })
    requested_professional: string;

    @Column('varchar', { length: 50, nullable: false })
    posted_jobs_description: string;

    @Column('varchar', { length: 50, nullable: false })
    posted_jobs_location: string;

    @Column('date', { nullable: false })
    posted_jobs_date: string;

    @Column('varchar', { length: 20, nullable: false })
    posted_jobs_priority: string;

    @Column('array', { array: true, nullable: false })
    posted_jobs_job_photos: string[];

    @Column('varchar', { length: 15, default: 'pendiente' })
    posted_jobs_status: string;

    // Faltan las relaciones
}
