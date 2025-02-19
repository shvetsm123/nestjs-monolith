import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { IUser } from '../common/types/types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    const comparedPassword = await bcrypt.compare(password, user.password);

    if (user && comparedPassword) return user;
    throw new UnauthorizedException('Wrong credentials');
  }

  async login(user: IUser) {
    const { id, email } = user;
    return {
      id,
      email,
      token: this.jwtService.sign({ id, email }),
    };
  }

  async googleAuth(email: string) {
    const userByEmail = await this.userService.findByEmail(email);
    if (userByEmail) return this.jwtService.sign({ id: userByEmail.id, email });

    return this.userService.create({ email });
  }
}
