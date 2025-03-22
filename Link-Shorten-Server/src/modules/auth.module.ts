import { Module } from '@nestjs/common';
//
import { AuthController } from 'src/controllers/auth.controller';
import { UserModule } from 'src/modules/user.module';
import { HttpModule } from 'src/modules/http.module';
import { MailModule } from 'src/modules/mail.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from 'src/services/auth.service';
import { TokenModule } from 'src/modules/token.module';
import { ResetCodeModule } from 'src/modules/resetcode.module';
@Module({
  imports: [
    UserModule,
    HttpModule,
    MailModule,
    TokenModule,
    ResetCodeModule,
    JwtModule.register({
      global: true,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
