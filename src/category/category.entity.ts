import { User } from 'src/user/user.entity';
import { PostedJob } from 'src/postedJob/postedJob.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @ManyToMany(() => User, (user) => user.categories, { cascade: true })
    users: User[];

    @ManyToMany(() => PostedJob, (postedJob) => postedJob.categories, {
        cascade: true,
    })
    postedJobs: PostedJob[];
}
