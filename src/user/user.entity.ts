import { PostedJob } from 'src/postedJob/postedJob.entity';
import { Location } from '../location/location.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 50, nullable: false })
    email: string;

    @Column({ type: 'varchar', length: 50, nullable: false })
    fullname: string;

    //Needs to be nullable for google authenticaction
    @Column({ type: 'varchar', length: 100, nullable: true })
    password: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    phone: string;

    @Column({ type: 'varchar', nullable: true })
    profileImg: string;

    //'professional', 'client' or 'admin'
    @Column({ type: 'varchar', nullable: true })
    role: string;

    @Column({ type: 'simple-array', nullable: true })
    profession: string[]; //FK MANY TO MANY WITH CATEGORY

    @Column({ type: 'float4', nullable: true })
    rating: number;

    @Column({ type: 'simple-array', nullable: true })
    services: string[];

    @Column({ type: 'boolean', default: false })
    availability: boolean;

    @Column({ type: 'varchar', length: 1000, nullable: true })
    bio: string;

    @Column({ type: 'simple-array', nullable: true })
    portfolio_gallery: string[];

    @Column({ type: 'int2', nullable: true })
    years_experience: number;

    @OneToMany(() => Location, (location) => location.user)
    locations: Location[];

    @OneToMany(() => PostedJob, (postedJob) => postedJob.client)
    postedJobs: PostedJob[];

    @OneToMany(() => PostedJob, (acceptedJob) => acceptedJob.professional)
    acceptedJobs: PostedJob[];
}
