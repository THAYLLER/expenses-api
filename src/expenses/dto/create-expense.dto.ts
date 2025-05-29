import {
  IsString,
  IsNumber,
  IsEnum,
  IsDateString,
  IsNotEmpty,
  Min,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ExpenseCategory {
  FOOD = 'FOOD',
  TRANSPORT = 'TRANSPORT',
  HOUSING = 'HOUSING',
  UTILITIES = 'UTILITIES',
  ENTERTAINMENT = 'ENTERTAINMENT',
  HEALTH = 'HEALTH',
  EDUCATION = 'EDUCATION',
  SHOPPING = 'SHOPPING',
  TRAVEL = 'TRAVEL',
  OTHER = 'OTHER',
}

export class CreateExpenseDto {
  @ApiProperty({
    description: 'Descrição da despesa',
    example: 'Almoço no restaurante',
    required: true,
    nullable: false,
    minLength: 3,
    maxLength: 100
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[\p{L}0-9\s\-_.,]+$/u, {
    message: 'A descrição deve conter apenas letras (com ou sem acento), números, espaços e os caracteres especiais: -_.,'
  })
  description: string;

  @ApiProperty({
    description: 'Valor da despesa',
    example: 50.99,
    minimum: 0,
    required: true,
    nullable: false
  })
  @IsNumber()
  @Min(0)
  @IsNotEmpty()
  amount: number;

  @ApiProperty({
    description: 'Categoria da despesa',
    enum: ExpenseCategory,
    example: ExpenseCategory.FOOD,
    required: true,
    nullable: false
  })
  @IsEnum(ExpenseCategory)
  @IsNotEmpty()
  category: ExpenseCategory;

  @ApiProperty({
    description: 'Data da despesa',
    example: '2024-03-20',
    required: true,
    nullable: false,
    format: 'date'
  })
  @IsDateString()
  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'A data deve estar no formato YYYY-MM-DD'
  })
  date: string;
}
