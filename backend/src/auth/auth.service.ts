import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from './entity/user.entity';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { UpdateUserDto } from './dto/update-user.dto';
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
      fullName,
    };

    const accessToken = this.jwtService.sign(payload);

    return { accessToken };
  }

  async getAllUsers(): Promise<UserResponse[]> {
    const users = await this.userRepository.find();

    return users.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      identification: user.identification,
      email: user.email,
      country: user.country,
      state: user.state,
      address: user.address,
      phoneNumber: user.phoneNumber,
      isActive: user.isActive,
    }));
  }

  // New method to update a user's avatar and/or password
  async updateUser(
    userId: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponse> {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new Error('User not found');
    }

    // Update avatar if provided
    if (updateUserDto.avatar !== undefined) {
      user.avatar = updateUserDto.avatar;
    }

    // Update password if provided
    if (updateUserDto.password) {
      const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
      user.password = hashedPassword;
    }

    // Save the updated user
    const updatedUser = await this.userRepository.save(user);

    // Return the updated user response
    const userResponse: UserResponse = {
      id: updatedUser.id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      identification: updatedUser.identification,
      email: updatedUser.email,
      country: updatedUser.country,
      state: updatedUser.state,
      address: updatedUser.address,
      phoneNumber: updatedUser.phoneNumber,
      isActive: updatedUser.isActive,
      avatar: updatedUser.avatar,
    };

    return userResponse;
  }

  async getAvatarById(userId: number): Promise<{ avatar: string | null }> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['avatar'],
    });

    if (!user) {
      return { avatar: null };
    }

    return { avatar: user.avatar || null };
  }
}
