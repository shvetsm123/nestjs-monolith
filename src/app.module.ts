import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { LoggerModule } from 'nestjs-pino';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { BrandModule } from './brand/brand.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { RedisModule } from './redis/redis.module';
import { ElasticModule } from './elastic/elastic.module';
import { StripeModule } from './stripe/stripe.module';
import { WebhookModule } from './webhook/webhook.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },
      },
    }),
    PrismaModule,
    UserModule,
    OrderModule,
    ProductModule,
    BrandModule,
    AuthModule,
    RedisModule,
    ElasticModule,
    StripeModule,
    WebhookModule,
    ChatModule,
  ],
})
export class AppModule {}
