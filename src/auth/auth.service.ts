import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { LoginResponse } from './dto/login-response';
import { LoginUserInput } from './dto/login-user.input';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username);

    if (user) {
      const valid = await bcrypt.compare(password, user.password);
      if (valid) {
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async login(user: User): Promise<LoginResponse> {
    return {
      access_token: this.jwtService.sign({ username: user.username, sub: user.id }),
      user
    }
  }

  async signUp(signUpInput: LoginUserInput) {
    const user = await this.usersService.findOne(signUpInput.username);
    if (user) throw new HttpException('This user already exists !', HttpStatus.CONFLICT);
    const hashedPass = await bcrypt.hash(signUpInput.password, 10);

    return this.usersService.create({
      ...signUpInput,
      password: hashedPass
    });
  }
}
