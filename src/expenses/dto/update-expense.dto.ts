import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsEnum, IsDateString, IsOptional, Min } from 'class-validator';
import { ExpenseCategory } from './create-expense.dto';

export class UpdateExpenseDto {
  @ApiProperty({
    description: 'Descrição da despesa',
    example: 'Almoço no restaurante',
    required: false,
    nullable: false
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Valor da despesa',
    example: 50.99,
    minimum: 0,
    required: false,
    nullable: false
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  amount?: number;

  @ApiProperty({
    description: 'Categoria da despesa',
    enum: ExpenseCategory,
    example: ExpenseCategory.FOOD,
    required: false,
    nullable: false
  })
  @IsEnum(ExpenseCategory)
  @IsOptional()
  category?: ExpenseCategory;

  @ApiProperty({
    description: 'Data da despesa',
    example: '2024-03-20',
    required: false,
    nullable: false,
    format: 'date'
  })
  @IsDateString()
  @IsOptional()
  date?: string;
}
