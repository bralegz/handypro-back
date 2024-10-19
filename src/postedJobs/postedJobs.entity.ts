import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('posted_jobs')
export class PostedJobsEntity {
    @PrimaryGeneratedColumn('uuid')
    posted_job_id: string;

    @Column('uuid', { default: null })
    client_id: string; // FK

    @Column('uuid', { default: null })
    professional_id: string; // FK

    @Column('uuid', { default: null })
    review_id: string; // FK

    @Column('uuid', { default: null })
    category_id: string; // FK

    @Column('varchar', { length: 800, nullable: false })
    posted_job_description: string;

    @Column('uuid', { default: null })
    location_id: string; // FK

    @Column('date', { nullable: false })
    posted_job_date: string;

    @Column('varchar', { length: 20, nullable: false })
    posted_job_priority: string;

    @Column('simple-array', { array: true, nullable: false })
    posted_job_photos: string[];

    @Column('varchar', { length: 15, default: 'pendiente' })
    posted_job_status: string;

    // Faltan las relaciones
}
