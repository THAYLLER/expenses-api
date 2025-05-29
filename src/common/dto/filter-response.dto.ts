import { ApiProperty } from '@nestjs/swagger';

export type FilterOperator = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'startsWith' | 'endsWith' | 'in' | 'notIn';

export class FilterResponseDto {
  @ApiProperty({ 
    description: 'Campo sendo filtrado',
    example: 'amount'
  })
  field: string;

  @ApiProperty({ 
    description: 'Operador do filtro',
    enum: ['eq', 'neq', 'gt', 'gte', 'lt', 'lte', 'contains', 'startsWith', 'endsWith', 'in', 'notIn'],
    example: 'gt'
  })
  operator: FilterOperator;

  @ApiProperty({ 
    description: 'Valor do filtro',
    oneOf: [
      { type: 'string', example: 'FOOD' },
      { type: 'number', example: 100 },
      { type: 'boolean', example: true },
      { type: 'array', items: { type: 'string' }, example: ['FOOD', 'TRANSPORT'] }
    ]
  })
  value: string | number | boolean | string[];
}
