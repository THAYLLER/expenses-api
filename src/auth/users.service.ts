import {
  Injectable,
  ConflictException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../infra/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    this.logger.debug(`Creating user with email: ${createUserDto.email}`);

    try {
      const userExists = await this.prisma.user.findUnique({
        where: { email: createUserDto.email },
      });
      if (userExists) throw new ConflictException('Email already registered');

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const user = await this.prisma.user.create({
        data: {
          email: createUserDto.email,
          password: hashedPassword,
        },
      });

      this.logger.debug(`User created successfully: ${user.id}`);
      return user;
    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`);
      throw error;
    }
  }

  async findByEmail(email: string) {
    this.logger.debug(`Finding user by email: ${email}`);

    try {
      return await this.prisma.user.findUnique({ where: { email } });
    } catch (error) {
      this.logger.error(`Error finding user by email: ${error.message}`);
      throw error;
    }
  }

  async findOne(id: string) {
    this.logger.debug(`Finding user by id: ${id}`);

    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) {
        this.logger.warn(`User not found for id: ${id}`);
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      this.logger.error(`Error finding user: ${error.message}`);
      throw error;
    }
  }

  async findById(id: string) {
    this.logger.debug(`Finding user by id: ${id}`);

    try {
      const user = await this.prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          password: true,
        },
      });

      if (!user) {
        this.logger.warn(`User not found for id: ${id}`);
        return null;
      }

      return user;
    } catch (error) {
      this.logger.error(`Error finding user by id: ${error.message}`);
      throw error;
    }
  }
} 