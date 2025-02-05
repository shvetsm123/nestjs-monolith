import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BaseResourceService } from '../common/base-resources/base-resource.service';

@Injectable()
export class UserService extends BaseResourceService {
  constructor(prisma: PrismaService) {
    super(prisma, 'user');
  }
}
