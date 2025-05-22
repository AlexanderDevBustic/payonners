import { IsEmail, IsString, MinLength, Matches } from 'class-validator';

export class SignUpDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @Matches(/^[a-zA-Z0-9]+$/, { message: 'IDENTIFICATION must be alphanumeric' })
  identification: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8, { message: 'PASSWORD must be at least 8 characters long' })
  password: string;

  @IsString()
  country: string;

  @IsString()
  state: string;

  @IsString()
  address: string;

  @IsString()
  @Matches(/^[0-9]+$/, { message: 'PHONE_NUMBER must be numeric' })
  phoneNumber: string;
}