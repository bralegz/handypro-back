import { Users } from '../users/users.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'locations' })
export class Locations {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 50 })
    name: string;

    //It generates a column called userId
    @ManyToOne(() => Users, (user) => user.locations)
    user: Users;
}
