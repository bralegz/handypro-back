import { User } from 'src/user/user.entity';
import { PostedJob } from 'src/postedJob/postedJob.entity';
import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @ManyToMany(() => User, (user) => user.profession, { cascade: true })
    @JoinTable()
    users: User[];

    @ManyToMany(() => PostedJob, (postedJob) => postedJob.categories, {
        cascade: true,
    })
    @JoinTable()
    postedJobs: PostedJob[];
}
