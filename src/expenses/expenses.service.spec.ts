import { Test, TestingModule } from '@nestjs/testing';
import { ExpensesService } from './expenses.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpenseCategory } from './dto/create-expense.dto';

describe('ExpensesService', () => {
  let service: ExpensesService;
  const mockUserId = 'user-1';

  const mockPrisma = {
    expense: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpensesService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ExpensesService>(ExpensesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an expense', async () => {
      const createExpenseDto: CreateExpenseDto = {
        description: 'Test expense',
        amount: 100,
        category: ExpenseCategory.FOOD,
        date: '2024-03-20',
      };

      const expectedExpense = { id: '1', ...createExpenseDto };
      mockPrisma.expense.create.mockResolvedValue(expectedExpense);

      const result = await service.create(mockUserId, createExpenseDto);

      expect(result).toEqual(expectedExpense);
      expect(mockPrisma.expense.create).toHaveBeenCalledWith({
        data: {
          ...createExpenseDto,
          date: new Date(createExpenseDto.date),
          user: {
            connect: { id: mockUserId },
          },
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of expenses', async () => {
      const expectedExpenses = [
        {
          id: '1',
          description: 'Test 1',
          amount: 100,
          category: ExpenseCategory.FOOD,
          date: '2024-03-20',
        },
        {
          id: '2',
          description: 'Test 2',
          amount: 200,
          category: ExpenseCategory.TRANSPORT,
          date: '2024-03-21',
        },
      ];

      mockPrisma.expense.findMany.mockResolvedValue(expectedExpenses);

      const result = await service.findAll(mockUserId);

      expect(result).toEqual(expectedExpenses);
      expect(mockPrisma.expense.findMany).toHaveBeenCalledWith({
        where: { user: { id: mockUserId } },
        orderBy: { date: 'desc' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a single expense', async () => {
      const expectedExpense = {
        id: '1',
        description: 'Test expense',
        amount: 100,
        category: ExpenseCategory.FOOD,
        date: '2024-03-20',
      };

      mockPrisma.expense.findFirst.mockResolvedValue(expectedExpense);

      const result = await service.findOne(mockUserId, '1');

      expect(result).toEqual(expectedExpense);
      expect(mockPrisma.expense.findFirst).toHaveBeenCalledWith({
        where: { id: '1', user: { id: mockUserId } },
      });
    });
  });

  describe('update', () => {
    it('should update an expense', async () => {
      const updateExpenseDto: UpdateExpenseDto = {
        description: 'Updated expense',
        amount: 150,
      };

      const expectedExpense = {
        id: '1',
        ...updateExpenseDto,
        category: ExpenseCategory.FOOD,
        date: '2024-03-20',
      };

      mockPrisma.expense.findFirst.mockResolvedValue(expectedExpense);
      mockPrisma.expense.update.mockResolvedValue(expectedExpense);

      const result = await service.update(mockUserId, '1', updateExpenseDto);

      expect(result).toEqual(expectedExpense);
      expect(mockPrisma.expense.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: updateExpenseDto,
      });
    });
  });

  describe('remove', () => {
    it('should remove an expense', async () => {
      const expectedExpense = {
        id: '1',
        description: 'Test expense',
        amount: 100,
        category: ExpenseCategory.FOOD,
        date: '2024-03-20',
      };

      mockPrisma.expense.findFirst.mockResolvedValue(expectedExpense);
      mockPrisma.expense.delete.mockResolvedValue(expectedExpense);

      const result = await service.remove(mockUserId, '1');

      expect(result).toEqual(expectedExpense);
      expect(mockPrisma.expense.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });
});
