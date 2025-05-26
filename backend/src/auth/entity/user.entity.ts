import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  identification: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  country: string;

  @Column()
  state: string;

  @Column()
  address: string;

  @Column()
  phoneNumber: string;

  @Column({ default: false })
  isActive: boolean;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  balanceCOP: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  balanceUSD: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  balanceEUR: number;
}