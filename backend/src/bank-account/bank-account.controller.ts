import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BankAccountService } from './bank-account.service';
import { Roles } from 'src/auth/util/roles.decorator';
import { RolesGuard } from 'src/auth/util/roles.guard';
import { FundsDto } from './dto/funds.dto';
import { CreateBankAccountDto } from './dto/create-bank-account.dto';
import { FundsWithdrawDto } from './dto/funds-withdraw.dto';

@Controller('bank-accounts')
export class BankAccountController {
  constructor(private readonly bankAccountService: BankAccountService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'USER')
  create(@Body() createBankAccountDto: CreateBankAccountDto) {
    return this.bankAccountService.create(createBankAccountDto);
  }

  @Get('/user/:userId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'USER')
  async findByUserId(@Param('userId') userId: string) {
    const parsedUserId = parseInt(userId, 10);
    if (isNaN(parsedUserId)) {
      throw new Error('Invalid userId');
    }
    return this.bankAccountService.findByUserId(parsedUserId);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  async findAll() {
    return this.bankAccountService.findAll();
  }

  @Post('/add-funds/:userId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  async addFunds(
    @Param('userId') userId: string,
    @Body() addFundsDto: FundsDto,
  ) {
    const parsedUserId = parseInt(userId, 10);

    if (isNaN(parsedUserId)) {
      throw new Error('Invalid userId');
    }

    return this.bankAccountService.addFundsToUser(
      addFundsDto.amount,
      parsedUserId,
      addFundsDto.currency,
    );
  }

  @Post('/withdraw/:userId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'USER')
  async withdrawFunds(
    @Param('userId') userId: string,
    @Body() withdrawFundsDto: FundsWithdrawDto,
  ) {
    const parsedUserId = parseInt(userId, 10);

    if (isNaN(parsedUserId)) {
      throw new Error('Invalid userId');
    }

    return this.bankAccountService.withdrawFundsFromUser(
      withdrawFundsDto.amount,
      parsedUserId,
      withdrawFundsDto.currency,
      withdrawFundsDto.accountId,
    );
  }

  @Get('/transactions')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  async getAllTransactions() {
    return this.bankAccountService.getAllTransactions();
  }

  @Get('/transactions/user/:userId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'USER')
  async getTransactionsByUserId(@Param('userId') userId: string) {
    const parsedUserId = parseInt(userId, 10);
    if (isNaN(parsedUserId)) {
      throw new Error('Invalid userId');
    }
    return this.bankAccountService.getTransactionsByUserId(parsedUserId);
  }

  @Get('/balance/:userId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'USER')
  async getUserBalance(@Param('userId') userId: string) {
    const parsedUserId = parseInt(userId, 10);
    if (isNaN(parsedUserId)) {
      throw new Error('Invalid userId');
    }
    return this.bankAccountService.getUserBalance(parsedUserId);
  }
}
