import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from './users.service';

export interface JwtPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    this.logger.debug(`Validating JWT payload: ${JSON.stringify(payload)}`);

    try {
      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        this.logger.warn(
          `User not found for payload: ${JSON.stringify(payload)}`,
        );
        throw new UnauthorizedException('No user found');
      }

      return { id: user.id, email: user.email };
    } catch (error) {
      this.logger.error(`Error validating JWT: ${error.message}`);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
