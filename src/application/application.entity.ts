import { PostedJob } from 'src/postedJob/postedJob.entity';
import { User } from 'src/user/user.entity';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Application {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar', { length: 20, default: 'pendiente' })
    status: string;

    @Column({ type: 'boolean', default: true })
    is_active: boolean;

    @ManyToOne(() => User, (user) => user.applications)
    @JoinColumn({ name: 'professionalId' })
    professional: User;

    @ManyToOne(() => PostedJob, (postedJob) => postedJob.applications)
    @JoinColumn({ name: 'postedJobId' })
    postedJob: PostedJob;
}
