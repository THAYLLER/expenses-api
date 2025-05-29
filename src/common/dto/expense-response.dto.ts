import { ApiProperty } from '@nestjs/swagger';

export class ExpenseResponseDto {
  @ApiProperty({ description: 'Expense ID' })
  id: string;

  @ApiProperty({ description: 'Expense description' })
  description: string;

  @ApiProperty({ description: 'Expense amount' })
  amount: number;

  @ApiProperty({ description: 'Expense category' })
  category: string;

  @ApiProperty({ description: 'Expense date' })
  date: Date;

  @ApiProperty({ description: 'User ID who created the expense' })
  userId: string;

  @ApiProperty({ description: 'Expense creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Expense last update date' })
  updatedAt: Date;
}
