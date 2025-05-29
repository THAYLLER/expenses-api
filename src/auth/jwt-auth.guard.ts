import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { JwtPayload } from './jwt.strategy';

interface JwtUser {
  id: string;
  email: string;
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private readonly logger = new Logger(JwtAuthGuard.name);

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      this.logger.error('No auth token');
      throw new UnauthorizedException('No auth token');
    }

    if (!authHeader.startsWith('Bearer ')) {
      this.logger.error('Invalid token format');
      throw new UnauthorizedException('Invalid token format');
    }

    this.logger.debug(`Validating request to: ${request.url}`);
    return super.canActivate(context);
  }

  handleRequest<TUser = JwtUser>(err: Error | null, user: TUser | null, info: { message: string } | null): TUser {
    if (err) {
      this.logger.error(`JWT validation error: ${err.message}`);
      throw new UnauthorizedException(err.message);
    }

    if (!user) {
      this.logger.error(
        `JWT validation failed: ${info?.message || 'No user found'}`,
      );
      throw new UnauthorizedException(info?.message || 'No user found');
    }

    return user;
  }
}
