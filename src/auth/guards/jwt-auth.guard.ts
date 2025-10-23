import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || user.name !== 'Pop') {
      console.log('info', info);
      console.log('err', err);
      if (info && info.message === 'No auth token')
        throw new UnauthorizedException('No auth token provided');
      throw (
        err ||
        new UnauthorizedException(`Permission denied for user: ${user.name}`)
      );
    }
    return user;
  }
}
