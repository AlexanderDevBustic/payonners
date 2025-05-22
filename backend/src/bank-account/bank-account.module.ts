import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankAccount } from './entity/bank-account.entity';
import { Transaction } from './entity/transaction.entity';
import { User } from '../auth/entity/user.entity';
import { BankAccountService } from './bank-account.service';
import { BankAccountController } from './bank-account.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BankAccount, Transaction, User])],
  providers: [BankAccountService],
  controllers: [BankAccountController],
})
export class BankAccountModule {}