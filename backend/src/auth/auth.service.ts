import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from './entity/user.entity';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { UserResponse } from './dto/user-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<UserResponse> {
    const {
      firstName,
      lastName,
      identification,
      email,
      password,
      country,
      state,
      address,
      phoneNumber,
    } = signUpDto;
  
    const existingUser = await this.userRepository.findOneBy([
      { identification },
      { email },
    ]);
    if (existingUser) {
      throw new Error('Identification or Email already exists');
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const user = this.userRepository.create({
      firstName,
      lastName,
      identification,
      email,
      password: hashedPassword,
      country,
      state,
      address,
      phoneNumber,
      isActive: true,
    });
  
    const savedUser = await this.userRepository.save(user);
  
    const userResponse: UserResponse = {
      id: savedUser.id,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      identification: savedUser.identification,
      email: savedUser.email,
      country: savedUser.country,
      state: savedUser.state,
      address: savedUser.address,
      phoneNumber: savedUser.phoneNumber,
      isActive: savedUser.isActive,
    };
  
    return userResponse;
  }

  async signIn(signInDto: SignInDto): Promise<{ accessToken: string }> {
    const { email, password } = signInDto;

    const user = await this.userRepository.findOneBy({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }

    const fullName = `${user.firstName} ${user.lastName}`;

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      fullName
    };

    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }
}