import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BankAccount } from './entity/bank-account.entity';
import { Transaction } from './entity/transaction.entity';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { User } from '../auth/entity/user.entity';

@Injectable()
export class BankAccountService {
  constructor(
    @InjectRepository(BankAccount)
    private readonly bankAccountRepository: Repository<BankAccount>,
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    createBankAccountDto: CreateBankAccountDto,
  ): Promise<BankAccount> {
    const newAccount = this.bankAccountRepository.create(createBankAccountDto);
    return await this.bankAccountRepository.save(newAccount);
  }

  async findByUserId(userId: number): Promise<BankAccount[]> {
    return this.bankAccountRepository.find({
      where: { userId },
    });
  }

  async findAll(): Promise<BankAccount[]> {
    return this.bankAccountRepository.find();
  }

  private async getUserById(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  private async getAccountById(accountId: number): Promise<BankAccount> {
    const account = await this.bankAccountRepository.findOne({
      where: { id: accountId },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return account;
  }

  private readonly COP_TO_USD_RATE = 0.00022;

  private async processFundsForUser(
    amount: number,
    userId: number,
    type: 'Deposit' | 'Withdrawal',
    currency: 'USD' | 'COP',
    accountId: number,
  ): Promise<{ message: string; newBalance: number }> {
    if (amount <= 0) {
      throw new BadRequestException(
        `${type === 'Deposit' ? 'Deposit amount' : 'Withdrawal amount'} must be greater than zero`,
      );
    }

    const user = await this.getUserById(userId);

    let withdrawAmountInCOP: number;

    switch (currency) {
      case 'USD':
        withdrawAmountInCOP = this.convertUSDtoCOP(amount);
        break;
      case 'COP':
        withdrawAmountInCOP = amount;
        break;
      default:
        throw new BadRequestException('Invalid currency');
    }

    const balanceKey = 'balanceCOP';

    const previousBalance = Number(user[balanceKey]);

    if (type === 'Withdrawal' && previousBalance < withdrawAmountInCOP) {
      throw new BadRequestException('Insufficient funds');
    }

    const newBalance =
      type === 'Deposit'
        ? previousBalance + withdrawAmountInCOP
        : previousBalance - withdrawAmountInCOP;

    user[balanceKey] = newBalance;

    await this.userRepository.save(user);

    const transaction = this.transactionRepository.create({
      type,
      amount: withdrawAmountInCOP,
      previousBalance,
      newBalance,
      userId,
      accountId,
      currency,
      createdAt: new Date(),
    });

    await this.transactionRepository.save(transaction);

    return {
      message: `${type === 'Deposit' ? 'Deposit' : 'Withdrawal'} successful`,
      newBalance,
    };
  }

  private convertUSDtoCOP(amountInUSD: number): number {
    const exchangeRate = 1 / this.COP_TO_USD_RATE;
    return amountInUSD * exchangeRate;
  }

  async addFundsToUser(
    amount: number,
    userId: number,
    currency: 'USD' | 'COP',
  ): Promise<{ message: string; newBalance: number }> {
    return this.processFundsForUser(amount, userId, 'Deposit', currency, 0);
  }

  async withdrawFundsFromUser(
    amount: number,
    userId: number,
    currency: 'USD' | 'COP',
    accountId: number,
  ): Promise<{ message: string; newBalance: number }> {
    return this.processFundsForUser(
      amount,
      userId,
      'Withdrawal',
      currency,
      accountId,
    );
  }

  async getAllTransactions(): Promise<Transaction[]> {
    return this.transactionRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async getTransactionsByUserId(userId: number): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async getTransactionsByAccountId(accountId: number): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: { accountId },
      order: { createdAt: 'DESC' },
    });
  }

  async getUserBalance(
    userId: number,
  ): Promise<{ balanceUSD: number; balanceCOP: number; balanceEUR: number }> {
    const user = await this.getUserById(userId);

    return {
      balanceUSD: user.balanceUSD,
      balanceCOP: user.balanceCOP,
      balanceEUR: user.balanceEUR,
    };
  }
}
