import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto, ExpenseCategory } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ExpensesService {
  private readonly logger = new Logger(ExpensesService.name);

  constructor(private prisma: PrismaService) {}

  async create(userId: string, createExpenseDto: CreateExpenseDto) {
    try {
      if (!Object.values(ExpenseCategory).includes(createExpenseDto.category)) {
        throw new BadRequestException('Categoria inválida');
      }

      if (createExpenseDto.amount <= 0) {
        throw new BadRequestException('Valor deve ser maior que zero');
      }

      const date = new Date(createExpenseDto.date);
      if (isNaN(date.getTime())) {
        throw new BadRequestException('Data inválida');
      }

      const data: Prisma.ExpenseCreateInput = {
        description: createExpenseDto.description,
        amount: createExpenseDto.amount,
        category: createExpenseDto.category,
        date,
        user: {
          connect: { id: userId },
        },
      };

      return await this.prisma.expense.create({ data });
    } catch (error) {
      this.logger.error(`Erro ao criar despesa: ${error.message}`, error.stack);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new BadRequestException('Já existe uma despesa com esses dados');
        }
        if (error.code === 'P2025') {
          throw new NotFoundException('Usuário não encontrado');
        }
      }
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao criar despesa');
    }
  }

  async findAll(
    userId: string,
    filters?: {
      category?: string;
      startDate?: string;
      endDate?: string;
    },
  ) {
    try {
      const where: Prisma.ExpenseWhereInput = {
        user: { id: userId },
      };

      if (filters?.startDate || filters?.endDate) {
        where.date = {};
        if (filters.startDate) {
          const startDate = new Date(filters.startDate);
          if (isNaN(startDate.getTime())) {
            throw new BadRequestException('Data inicial inválida');
          }
          where.date.gte = startDate;
        }
        if (filters.endDate) {
          const endDate = new Date(filters.endDate);
          if (isNaN(endDate.getTime())) {
            throw new BadRequestException('Data final inválida');
          }
          where.date.lte = endDate;
        }
      }

      if (filters?.category) {
        if (!Object.values(ExpenseCategory).includes(filters.category as ExpenseCategory)) {
          throw new BadRequestException('Categoria inválida');
        }
        where.category = filters.category as ExpenseCategory;
      }

      return await this.prisma.expense.findMany({
        where,
        orderBy: {
          date: 'desc',
        },
      });
    } catch (error) {
      this.logger.error(`Erro ao buscar despesas: ${error.message}`, error.stack);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao buscar despesas');
    }
  }

  async findOne(userId: string, id: string) {
    try {
      const expense = await this.prisma.expense.findFirst({
        where: {
          id,
          user: { id: userId },
        },
      });

      if (!expense) {
        throw new NotFoundException('Despesa não encontrada');
      }

      return expense;
    } catch (error) {
      this.logger.error(`Erro ao buscar despesa: ${error.message}`, error.stack);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Despesa não encontrada');
        }
      }
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao buscar despesa');
    }
  }

  async update(userId: string, id: string, updateExpenseDto: UpdateExpenseDto) {
    try {
      const expense = await this.findOne(userId, id);

      if (updateExpenseDto.amount !== undefined && updateExpenseDto.amount <= 0) {
        throw new BadRequestException('Valor deve ser maior que zero');
      }

      if (updateExpenseDto.category && !Object.values(ExpenseCategory).includes(updateExpenseDto.category)) {
        throw new BadRequestException('Categoria inválida');
      }

      if (updateExpenseDto.date) {
        const date = new Date(updateExpenseDto.date);
        if (isNaN(date.getTime())) {
          throw new BadRequestException('Data inválida');
        }
      }

      const data: Prisma.ExpenseUpdateInput = {
        ...(updateExpenseDto.description && { description: updateExpenseDto.description }),
        ...(updateExpenseDto.amount && { amount: updateExpenseDto.amount }),
        ...(updateExpenseDto.category && { category: updateExpenseDto.category }),
        ...(updateExpenseDto.date && { date: new Date(updateExpenseDto.date) }),
      };

      return await this.prisma.expense.update({
        where: { id: expense.id },
        data,
      });
    } catch (error) {
      this.logger.error(`Erro ao atualizar despesa: ${error.message}`, error.stack);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Despesa não encontrada');
        }
      }
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao atualizar despesa');
    }
  }

  async remove(userId: string, id: string) {
    try {
      const expense = await this.findOne(userId, id);
      return await this.prisma.expense.delete({ where: { id: expense.id } });
    } catch (error) {
      this.logger.error(`Erro ao remover despesa: ${error.message}`, error.stack);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Despesa não encontrada');
        }
      }
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Erro ao remover despesa');
    }
  }
}
