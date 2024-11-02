import { User } from 'src/user/user.entity';
import { PostedJob } from 'src/postedJob/postedJob.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 100 })
    name: string;
    
    @Column({ type: 'boolean', default: true })
    is_active: boolean;

    @ManyToMany(() => User, (user) => user.categories, { cascade: true })
    users: User[];

    @ManyToMany(() => PostedJob, (postedJob) => postedJob.categories, {
        cascade: true,
    })
    postedJobs: PostedJob[];
}
