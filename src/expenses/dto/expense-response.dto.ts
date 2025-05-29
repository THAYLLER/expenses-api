import { ApiProperty } from '@nestjs/swagger';
import { ExpenseCategory } from './create-expense.dto';
import { IsUUID, IsString, IsNumber, IsEnum, IsDate, Min } from 'class-validator';

export class ExpenseResponseDto {
  @ApiProperty({
    description: 'ID único da despesa',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'Descrição da despesa',
    example: 'Almoço no restaurante'
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Valor da despesa',
    example: 50.99,
    minimum: 0
  })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiProperty({
    description: 'Categoria da despesa',
    enum: ExpenseCategory,
    example: 'FOOD'
  })
  @IsEnum(ExpenseCategory)
  category: ExpenseCategory;

  @ApiProperty({
    description: 'Data da despesa',
    example: '2024-03-20T00:00:00.000Z',
    format: 'date-time'
  })
  @IsDate()
  date: Date;

  @ApiProperty({
    description: 'ID do usuário que criou a despesa',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid'
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'Data de criação do registro',
    example: '2024-03-20T00:00:00.000Z',
    format: 'date-time'
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'Data da última atualização do registro',
    example: '2024-03-20T00:00:00.000Z',
    format: 'date-time'
  })
  @IsDate()
  updatedAt: Date;
}
