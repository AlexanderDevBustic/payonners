import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('bank_accounts')
export class BankAccount {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20 })
  identificationNumber: string;

  @Column({ type: 'varchar', length: 100 })
  accountHolder: string;

  @Column({ type: 'varchar', length: 50 })
  bankName: string;

  @Column({ type: 'varchar', length: 50 })
  accountNumber: string;

  @Column({ type: 'enum', enum: ['Personal', 'Negocio'] })
  accountType: 'Personal' | 'Negocio';

  @Column({ type: 'varchar', length: 50 })
  country: string;

  @Column({ type: 'enum', enum: ['COP', 'USD', 'EUR'] })
  currency: 'COP' | 'USD' | 'EUR';

  @Column({ type: 'enum', enum: ['Cuenta Corriente', 'Cuenta Ahorros'] })
  accountCategory: 'Cuenta Corriente' | 'Cuenta Ahorros';

  @Column({ type: 'bigint', default: 0 })
  balance: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'int', nullable: false })
  userId: number;
}
