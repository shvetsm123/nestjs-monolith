import { Injectable, OnModuleInit } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { PrismaService } from '../prisma/prisma.service';
import { IProductWithBrand } from '../common/types/types';

@Injectable()
export class ElasticService implements OnModuleInit {
  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private readonly prismaService: PrismaService,
  ) {}

  private readonly PRODUCTS_WITH_BRANDS_INDEX = 'products-with-brands';

  async createIndexProductsWithBrands() {
    try {
      const indexExists = await this.elasticsearchService.indices.exists({
        index: this.PRODUCTS_WITH_BRANDS_INDEX,
      });

      if (!indexExists) {
        await this.elasticsearchService.indices.create({
          index: this.PRODUCTS_WITH_BRANDS_INDEX,
          body: {
            settings: {
              analysis: {
                tokenizer: {
                  edge_ngram_tokenizer: {
                    type: 'edge_ngram',
                    min_gram: 1,
                    max_gram: 25,
                    token_chars: ['letter', 'digit'],
                  },
                },
                analyzer: {
                  edge_ngram_analyzer: {
                    type: 'custom',
                    tokenizer: 'edge_ngram_tokenizer',
                  },
                },
              },
            },
            mappings: {
              properties: {
                title: {
                  type: 'text',
                  analyzer: 'standard',
                },
                description: {
                  type: 'text',
                  analyzer: 'standard',
                },
                brand: {
                  properties: {
                    title: {
                      type: 'text',
                      analyzer: 'standard',
                    },
                  },
                },
              },
            },
          },
        });
        console.log('Index was created');
      }
    } catch (err) {
      console.error('Error while creating index: ', err);
    }
  }

  async deleteIndexProductsWithBrands() {
    try {
      const indexExists = await this.elasticsearchService.indices.exists({
        index: this.PRODUCTS_WITH_BRANDS_INDEX,
      });

      if (indexExists) {
        await this.elasticsearchService.indices.delete({
          index: this.PRODUCTS_WITH_BRANDS_INDEX,
        });
        console.log('Index was deleted');
      }
    } catch (err) {
      console.error('Error while deleting index:', err);
    }
  }

  async indexProductWithBrand(product: IProductWithBrand) {
    await this.elasticsearchService.index({
      index: this.PRODUCTS_WITH_BRANDS_INDEX,
      id: product.id.toString(),
      body: {
        title: product.title,
        description: product.description,
        brand: product.brand,
      },
    });
  }

  async indexAllProductsWithBrands() {
    const products = await this.prismaService.product.findMany({
      include: {
        Brand: true,
      },
    });

    for (const product of products) {
      await this.indexProductWithBrand({
        id: product.id,
        title: product.title,
        description: product.description,
        brand: product.Brand,
      });
    }
  }

  async onModuleInit() {
    await this.deleteIndexProductsWithBrands();
    await this.createIndexProductsWithBrands();
    await this.indexAllProductsWithBrands();
  }

  async searchProductsWithBrands(query: string) {
    const result = await this.elasticsearchService.search({
      index: this.PRODUCTS_WITH_BRANDS_INDEX,
      body: {
        query: {
          bool: {
            should: [
              { match_phrase_prefix: { title: query } },
              { match_phrase_prefix: { description: query } },
              { match_phrase_prefix: { 'brand.title': query } },
            ],
            minimum_should_match: 1,
          },
        },
      },
    });
    return result.hits.hits.map((hit: any) => hit._source);
  }

  async getIndices() {
    return await this.elasticsearchService.cat.indices({
      format: 'json',
    });
  }
}
