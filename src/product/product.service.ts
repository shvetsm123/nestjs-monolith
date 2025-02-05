import { Injectable } from '@nestjs/common';
import { BaseResourceService } from '../common/base-resources/base-resource.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductService extends BaseResourceService {
  constructor(prisma: PrismaService) {
    super(prisma, 'product');
  }
}
