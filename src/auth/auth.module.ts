import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.register({
      global: true,
      secret: 'your-secret-key',
      signOptions: { expiresIn: '1h' },
    }),
    PassportModule,
  ],
  exports: [AuthService],
})
export class AuthModule {}
