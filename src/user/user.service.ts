import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BaseResourceService } from '../common/base-resources/base-resource.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService extends BaseResourceService {
  constructor(prisma: PrismaService) {
    super(prisma, 'user');
  }

  async create(dto: CreateUserDto) {
    const { email, password } = dto;
    const existingUser = await this.findByEmail(email);
    if (existingUser) throw new BadRequestException('User already exists!');

    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
    return this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
