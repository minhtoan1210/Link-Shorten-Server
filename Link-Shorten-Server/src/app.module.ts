import { Module } from '@nestjs/common';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { CommandModule } from 'nestjs-command';
//
import { AuthModule } from 'src/modules/auth.module';
import { CurrencyModule } from 'src/modules/currency.module';
import { GroupModule } from 'src/modules/group.module';
import { GuardModule } from 'src/modules/guard.module';
import { HttpModule } from 'src/modules/http.module';
import { LinkModule } from 'src/modules/link.module';
import { MailModule } from './modules/mail.module';
import { OrganizationActionModule } from 'src/modules/organization_action.module';
import { OrganizationPermissionModule } from 'src/modules/organization_permission.module';
import { OrganizationRoleModule } from 'src/modules/organization_role.module';
import { OrganizationModule } from 'src/modules/organization.module';
import { PlanModule } from 'src/modules/plan.module';
import { ResetCodeModule } from 'src/modules/resetcode.module';
import { TokenModule } from 'src/modules/token.module';
import { UserInvitationModule } from 'src/modules/user_invitation.module';
import { UserModule } from 'src/modules/user.module';
//
import { GoogleStrategy } from 'src/strategies/google.strategy';
//import { SeederService } from 'src/services/seeder.service';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('DB_HOST'),
      }),
    }),
    AuthModule,
    CommandModule,
    CurrencyModule,
    GroupModule,
    GuardModule,
    HttpModule,
    LinkModule,
    MailModule,
    OrganizationActionModule,
    OrganizationPermissionModule,
    OrganizationRoleModule,
    OrganizationModule,
    PassportModule,
    PlanModule,
    ResetCodeModule,
    TokenModule,
    UserInvitationModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, GoogleStrategy],
})
export class AppModule {}
