import { PostedJob } from 'src/postedJob/postedJob.entity';
import { User } from '../user/user.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Location {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 50 })
    name: string;

    @Column({ type: 'boolean', default: true })
    is_active: boolean;

    @OneToMany(() => User, (user) => user.location)
    users: User[];

    @OneToMany(() => PostedJob, (postedJob) => postedJob.location)
    postedJobs: PostedJob[];
}
