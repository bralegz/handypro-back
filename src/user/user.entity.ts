import { PostedJob } from 'src/postedJob/postedJob.entity';
import { Location } from '../location/location.entity';
import {
    BeforeInsert,
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from 'src/category/category.entity';
import { Application } from '../application/application.entity';
import * as bcrypt from 'bcrypt';

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

    @Column({ nullable: true })
    hashedRefreshToken: string;

    @ManyToOne(() => Location, (location) => location.users)
    location: Location;

    @OneToMany(() => PostedJob, (postedJob) => postedJob.client)
    postedJobs: PostedJob[];

    // @OneToMany(() => PostedJob, (acceptedJob) => acceptedJob.professional)
    // acceptedJobs: PostedJob[];

    @ManyToMany(() => Category, (category) => category.users)
    @JoinTable({ name: 'user_categories' })
    categories: Category[];

    @OneToMany(() => Application, (application) => application.professional)
    applications: Application;

    @BeforeInsert()
    async hashPassword() {
        //1st parameter: plain password -- 2nd parameter: salt rounds
        this.password = await bcrypt.hash(this.password, 10);
    }
}
