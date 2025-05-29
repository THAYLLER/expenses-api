import { ApiProperty } from '@nestjs/swagger';

export type ReportParameters = {
  startDate?: string;
  endDate?: string;
  category?: string;
  groupBy?: 'day' | 'week' | 'month' | 'year';
  sortBy?: 'amount' | 'date';
  sortOrder?: 'asc' | 'desc';
};

export type ReportResult = {
  total: number;
  average: number;
  count: number;
  items: Array<{
    date: string;
    amount: number;
    category?: string;
  }>;
};

class ReportParametersDto {
  @ApiProperty({ type: 'string', format: 'date', example: '2024-01-01', required: false })
  startDate?: string;

  @ApiProperty({ type: 'string', format: 'date', example: '2024-12-31', required: false })
  endDate?: string;

  @ApiProperty({ type: 'string', example: 'FOOD', required: false })
  category?: string;

  @ApiProperty({ 
    type: 'string', 
    enum: ['day', 'week', 'month', 'year'], 
    example: 'month',
    required: false 
  })
  groupBy?: 'day' | 'week' | 'month' | 'year';

  @ApiProperty({ 
    type: 'string', 
    enum: ['amount', 'date'], 
    example: 'amount',
    required: false 
  })
  sortBy?: 'amount' | 'date';

  @ApiProperty({ 
    type: 'string', 
    enum: ['asc', 'desc'], 
    example: 'desc',
    required: false 
  })
  sortOrder?: 'asc' | 'desc';
}

class ReportItemDto {
  @ApiProperty({ type: 'string', example: '2024-03' })
  date: string;

  @ApiProperty({ type: 'number', example: 500.25 })
  amount: number;

  @ApiProperty({ type: 'string', example: 'FOOD', required: false })
  category?: string;
}

class ReportResultDto {
  @ApiProperty({ type: 'number', example: 1500.50 })
  total: number;

  @ApiProperty({ type: 'number', example: 75.02 })
  average: number;

  @ApiProperty({ type: 'number', example: 20 })
  count: number;

  @ApiProperty({ type: [ReportItemDto] })
  items: ReportItemDto[];
}

export class ReportResponseDto {
  @ApiProperty({ description: 'Report ID' })
  id: string;

  @ApiProperty({ description: 'Report name' })
  name: string;

  @ApiProperty({ description: 'Report description' })
  description: string;

  @ApiProperty({ description: 'Report type' })
  type: string;

  @ApiProperty({ type: ReportParametersDto })
  parameters: ReportParameters;

  @ApiProperty({ type: ReportResultDto })
  result: ReportResult;

  @ApiProperty({ description: 'User ID who created the report' })
  userId: string;

  @ApiProperty({ description: 'Report creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Report last update date' })
  updatedAt: Date;
}
