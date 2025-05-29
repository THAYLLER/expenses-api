import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseUUIDPipe,
  Request,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery, ApiParam, ApiCreatedResponse, ApiOkResponse, ApiNotFoundResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiBody } from '@nestjs/swagger';
import { ExpenseResponseDto } from './dto/expense-response.dto';
import { ExpenseCategory } from './dto/create-expense.dto';

interface RequestWithUser extends Request {
  user: {
    id: string;
    email: string;
  };
}

@ApiTags('expenses')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Criar uma nova despesa',
    description: 'Cria uma nova despesa para o usuário autenticado'
  })
  @ApiBody({ type: CreateExpenseDto })
  @ApiCreatedResponse({
    description: 'Despesa criada com sucesso',
    type: ExpenseResponseDto
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'array', items: { type: 'string' }, example: ['Valor deve ser maior que zero'] },
        error: { type: 'string', example: 'Bad Request' }
      }
    }
  })
  @ApiUnauthorizedResponse({
    description: 'Não autorizado',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Não autorizado' },
        error: { type: 'string', example: 'Unauthorized' }
      }
    }
  })
  create(
    @Body(new ValidationPipe({ transform: true })) createExpenseDto: CreateExpenseDto,
    @Request() req: RequestWithUser
  ) {
    return this.expensesService.create(req.user.id, createExpenseDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Listar todas as despesas do usuário',
    description: 'Retorna todas as despesas do usuário autenticado, com opção de filtros'
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description: 'Data inicial no formato YYYY-MM-DD',
    example: '2024-01-01'
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description: 'Data final no formato YYYY-MM-DD',
    example: '2024-12-31'
  })
  @ApiQuery({
    name: 'category',
    required: false,
    type: String,
    description: 'Categoria da despesa',
    enum: Object.values(ExpenseCategory),
    example: ExpenseCategory.FOOD
  })
  @ApiOkResponse({
    description: 'Lista de despesas retornada com sucesso',
    type: [ExpenseResponseDto]
  })
  @ApiUnauthorizedResponse({
    description: 'Não autorizado',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Não autorizado' },
        error: { type: 'string', example: 'Unauthorized' }
      }
    }
  })
  findAll(
    @Request() req: RequestWithUser,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('category') category?: ExpenseCategory,
  ) {
    if (startDate && !this.isValidDate(startDate)) {
      throw new BadRequestException('Data inicial inválida. Use o formato YYYY-MM-DD');
    }

    if (endDate && !this.isValidDate(endDate)) {
      throw new BadRequestException('Data final inválida. Use o formato YYYY-MM-DD');
    }

    return this.expensesService.findAll(req.user.id, {
      category,
      startDate,
      endDate,
    });
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Buscar uma despesa específica',
    description: 'Retorna os detalhes de uma despesa específica do usuário autenticado'
  })
  @ApiParam({
    name: 'id',
    description: 'ID da despesa (UUID)',
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiOkResponse({
    description: 'Despesa encontrada com sucesso',
    type: ExpenseResponseDto
  })
  @ApiNotFoundResponse({
    description: 'Despesa não encontrada',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Despesa não encontrada' },
        error: { type: 'string', example: 'Not Found' }
      }
    }
  })
  @ApiUnauthorizedResponse({
    description: 'Não autorizado',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Não autorizado' },
        error: { type: 'string', example: 'Unauthorized' }
      }
    }
  })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: RequestWithUser
  ) {
    return this.expensesService.findOne(req.user.id, id);
  }

  @Patch(':id')
  @ApiOperation({ 
    summary: 'Atualizar uma despesa',
    description: 'Atualiza os dados de uma despesa específica do usuário autenticado'
  })
  @ApiParam({
    name: 'id',
    description: 'ID da despesa (UUID)',
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiBody({ type: UpdateExpenseDto })
  @ApiOkResponse({
    description: 'Despesa atualizada com sucesso',
    type: ExpenseResponseDto
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'array', items: { type: 'string' }, example: ['Valor deve ser maior que zero'] },
        error: { type: 'string', example: 'Bad Request' }
      }
    }
  })
  @ApiNotFoundResponse({
    description: 'Despesa não encontrada',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Despesa não encontrada' },
        error: { type: 'string', example: 'Not Found' }
      }
    }
  })
  @ApiUnauthorizedResponse({
    description: 'Não autorizado',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Não autorizado' },
        error: { type: 'string', example: 'Unauthorized' }
      }
    }
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(new ValidationPipe({ transform: true })) updateExpenseDto: UpdateExpenseDto,
    @Request() req: RequestWithUser
  ) {
    return this.expensesService.update(req.user.id, id, updateExpenseDto);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Remover uma despesa',
    description: 'Remove uma despesa específica do usuário autenticado'
  })
  @ApiParam({
    name: 'id',
    description: 'ID da despesa (UUID)',
    type: 'string',
    format: 'uuid',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @ApiOkResponse({
    description: 'Despesa removida com sucesso',
    type: ExpenseResponseDto
  })
  @ApiNotFoundResponse({
    description: 'Despesa não encontrada',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Despesa não encontrada' },
        error: { type: 'string', example: 'Not Found' }
      }
    }
  })
  @ApiUnauthorizedResponse({
    description: 'Não autorizado',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Não autorizado' },
        error: { type: 'string', example: 'Unauthorized' }
      }
    }
  })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: RequestWithUser
  ) {
    return this.expensesService.remove(req.user.id, id);
  }

  private isValidDate(dateString: string): boolean {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;

    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  }
}
