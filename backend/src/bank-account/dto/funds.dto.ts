import { IsNumber, IsPositive } from 'class-validator';

export class FundsDto {
  @IsNumber()
  @IsPositive()
  amount: number;
  
  currency: 'USD' | 'COP';
}