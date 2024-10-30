import { Application } from 'src/application/application.entity';
import { Category } from 'src/category/category.entity';
import { Location } from 'src/location/location.entity';
import { Payment } from 'src/payment/payment.entity';
import { Review } from 'src/review/review.entity';
import { User } from 'src/user/user.entity';
import {
    Column,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class PostedJob {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('varchar', { length: 100, nullable: false })
    title: string;

    @ManyToOne(() => User, (user) => user.postedJobs)
    @JoinColumn({ name: 'clientId' })
    client: User;

    @OneToOne(() => Review)
    @JoinColumn({ name: 'reviewId' })
    review: Review;

    @Column('varchar', { length: 800, nullable: false })
    description: string;

    @ManyToOne(() => Location, (location) => location.postedJobs)
    @JoinColumn({ name: 'locationId' })
    location: Location;

    @Column('date', { nullable: false })
    date: string;

    @Column('varchar', { length: 20, nullable: false })
    priority: string;

    @Column('text', { array: true, nullable: false })
    photos: string[];

    @Column('varchar', { length: 15, default: 'pendiente' })
    status: string;

    @ManyToMany(() => Category, (category) => category.postedJobs)
    @JoinTable()
    categories: Category[];

    @OneToMany(() => Application, (application) => application.postedJob)
    applications: Application[];

    @OneToMany(() => Payment, (payment) => payment.postedJob)
    payments: Payment[];

}
