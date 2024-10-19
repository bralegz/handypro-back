import { PostedJob } from 'src/postedJob/postedJob.entity';
import { User } from '../user/user.entity';
import {
    Column,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Location {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 50 })
    name: string;

    //It generates a column called userId
    @ManyToOne(() => User, (user) => user.locations)
    user: User;

    @OneToMany(() => PostedJob, (postedJob) => postedJob.location)
    postedJobs: PostedJob[];
}
