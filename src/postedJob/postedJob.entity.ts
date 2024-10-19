import { Review } from 'src/review/review.entity';
import { User } from 'src/user/user.entity';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class PostedJob {
    @PrimaryGeneratedColumn('uuid')
    posted_job_id: string;

    @ManyToOne(() => User, (user) => user.postedJobs)
    @JoinColumn({ name: 'clientId' })
    client: User;

    @ManyToOne(() => User, (user) => user.acceptedJobs)
    @JoinColumn({ name: 'professionalId' })
    professional: User;

    @OneToOne(() => Review)
    @JoinColumn({name: 'reviewId'})
    review: Review;

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
