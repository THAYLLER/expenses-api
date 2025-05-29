import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, RegisterSchema } from './dto/register.dto';
import { LoginDto, LoginSchema } from './dto/login.dto';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiBadRequestResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { RegisterDtoSwagger } from './dto/register.dto';
import { LoginDtoSwagger } from './dto/login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ 
    summary: 'Registrar um novo usuário',
    description: 'Cria uma nova conta de usuário e retorna um token JWT para autenticação'
  })
  @ApiBody({ 
    type: RegisterDtoSwagger,
    description: 'Dados do usuário para registro'
  })
  @ApiCreatedResponse({
    description: 'Usuário registrado com sucesso',
    type: RegisterDtoSwagger,
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          description: 'Token JWT para autenticação'
        }
      }
    }
  })
  @ApiBadRequestResponse({
    description: 'Dados inválidos ou email já registrado',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Email já registrado' },
        error: { type: 'string', example: 'Bad Request' }
      }
    }
  })
  async register(
    @Body(new ZodValidationPipe(RegisterSchema)) registerDto: RegisterDto,
  ) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ 
    summary: 'Fazer login',
    description: 'Autentica um usuário existente e retorna um token JWT'
  })
  @ApiBody({ 
    type: LoginDtoSwagger,
    description: 'Credenciais do usuário'
  })
  @ApiOkResponse({
    description: 'Login realizado com sucesso',
    type: LoginDtoSwagger,
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          description: 'Token JWT para autenticação'
        }
      }
    }
  })
  @ApiUnauthorizedResponse({
    description: 'Credenciais inválidas',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Credenciais inválidas' },
        error: { type: 'string', example: 'Unauthorized' }
      }
    }
  })
  async login(@Body(new ZodValidationPipe(LoginSchema)) loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
