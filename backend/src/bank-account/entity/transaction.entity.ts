import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ['Deposit', 'Withdrawal'] })
  type: 'Deposit' | 'Withdrawal';

  @Column({ type: 'bigint', default: 0 })
  amount: number;

  @Column({ type: 'bigint', default: 0 })
  previousBalance: number;

  @Column({ type: 'bigint', default: 0 })
  newBalance: number;
  
  @Column({ type: 'int' })
  userId: number;

  @Column({ type: 'enum', enum: ['COP', 'USD', 'EUR'] })
  currency: 'COP' | 'USD' | 'EUR';

  @Column({ type: 'int' })
  accountId: number; 

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}