import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { BankAccountModule } from './bank-account/bank-account.module';
import * as dotenv from 'dotenv';

import { User } from './auth/entity/user.entity';
import { BankAccount } from './bank-account/entity/bank-account.entity';
import { Transaction } from './bank-account/entity/transaction.entity';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      url: process.env.DATABASE_URL,
      entities: [User, BankAccount, Transaction],
      synchronize: true,
      logging: false,
    }),
    AuthModule,
    BankAccountModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}