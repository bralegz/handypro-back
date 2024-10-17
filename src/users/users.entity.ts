import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  email: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  fullname: string;

  //Needs to be nullable for google authenticaction
  @Column({ type: 'varchar', length: 100, nullable: true })
  password: string;

  //Needs to be nullable for google authenticaction
  @Column({ type: 'varchar', length: 100, nullable: true })
  confirmationPassword: string;

  //User will need a phone number
  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  //User can edit profile picture
  @Column({ type: 'varchar', nullable: true })
  profileImg: string;

  //User can be 'professional', 'client' or 'admin'
  @Column({ type: 'varchar', nullable: true })
  role: string;

  //another entity? many to many?
  @Column({ type: 'simple-array', nullable: true })
  profession: string[];

  //user will need location to use the services but won't define one when he registers.
  @Column({ type: 'varchar', nullable: true })
  location: string;

  //calculated from all the reviews linked to this user
  @Column({ type: 'float4', nullable: true })
  rating: number;

  //defined by the user
  @Column({ type: 'simple-array', nullable: true })
  services: string[];

  //professional can switch his availability
  @Column({ type: 'boolean', default: false })
  availability: boolean;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  bio: string;

  //Photos can be added by the worker
  @Column({ type: 'simple-array', nullable: true })
  portfolio_gallery: string[];

  //Years of experience can be added by the worker
  @Column({ type: 'int2', nullable: true })
  years_experience: number;
}
