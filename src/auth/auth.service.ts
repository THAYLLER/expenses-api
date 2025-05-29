import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { UsersService } from './users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;

    if (password.length < 6) {
      throw new BadRequestException('A senha deve ter pelo menos 6 caracteres');
    }

    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('Email já cadastrado');
    }

    const createUserDto: CreateUserDto = {
      email,
      password,
    };

    const user = await this.usersService.create(createUserDto);

    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
    });

    this.logger.debug(
      `Token gerado no registro para usuário ${user.id}: ${token}`,
    );
    return { access_token: token };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    if (password.length < 6) {
      throw new BadRequestException('A senha deve ter pelo menos 6 caracteres');
    }

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET'),
    });

    this.logger.debug(
      `Token gerado no login para usuário ${user.id}: ${token}`,
    );
    return { access_token: token };
  }
}
