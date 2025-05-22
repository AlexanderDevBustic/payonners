import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  Patch,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { Roles } from './util/roles.decorator';
import { RolesGuard } from './util/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('/api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto): Promise<any> {
    return this.authService.signUp(signUpDto);
  }

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() signInDto: SignInDto): Promise<{ accessToken: string }> {
    return this.authService.signIn(signInDto);
  }

  @Get('users')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  async getAllUsers(): Promise<any> {
    return this.authService.getAllUsers();
  }

  @Patch('update/:id')
  @UseGuards(AuthGuard('jwt'))
  @Roles('ADMIN', 'USER')
  async updateUser(
    @Param('id') userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<any> {
    return this.authService.updateUser(userId, updateUserDto);
  }

  @Get('avatar/:id')
  @UseGuards(AuthGuard('jwt'))
  async getAvatarById(
    @Param('id') userId: number,
  ): Promise<{ avatar: string | null }> {
    return this.authService.getAvatarById(userId);
  }
}
