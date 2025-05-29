import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExpensesModule } from '../expenses/expenses.module';
import { PrismaModule } from '../../infra/prisma/prisma.module';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [ExpensesModule, PrismaModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
