import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'],
    });
  }

  async onModuleInit() {
    this.logger.debug('Connecting to database...');
    await this.$connect();
    this.logger.debug('Connected to database successfully');
  }

  async onModuleDestroy() {
    this.logger.debug('Disconnecting from database...');
    await this.$disconnect();
    this.logger.debug('Disconnected from database successfully');
  }
}
