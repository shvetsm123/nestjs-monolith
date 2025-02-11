import { Global, Module } from '@nestjs/common';
import { ElasticService } from './elastic.service';
import { ElasticController } from './elastic.controller';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        node: configService.get('ELASTICSEARCH_URL'),
        requestTimeout: 600,
        ssl: false,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [ElasticController],
  providers: [ElasticService],
})
export class ElasticModule {}
