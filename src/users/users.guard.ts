import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const headers = request.headers.authorization;
    if (!headers) {
      throw new UnauthorizedException('Missing authorization header');
    }
    const token = headers.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token is missing');
    }
    try {
      const tokenPayload = await this.jwtService.verifyAsync(token);
      request.user = tokenPayload;
      return true;
    } catch (error: unknown) {
      console.error(error);
      throw new UnauthorizedException('Invalid token g');
    }
  }
}
