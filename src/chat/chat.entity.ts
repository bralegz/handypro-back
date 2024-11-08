import { User } from "src/user/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Chat {
    @PrimaryGeneratedColumn('uuid')
    id: string; 

    @Column({ type: 'varchar', length: 100, nullable: false })   
    username: string;

    @Column({ type: 'varchar', length: 100, nullable: false })
    room: string;

    @Column({type: 'text', nullable: false})
    message: string;

    @CreateDateColumn({type: 'timestamp'})
    timestamp: Date;

}


