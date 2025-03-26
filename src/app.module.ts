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
import * as mongoose from 'mongoose';

//
import { GoogleStrategy } from 'src/strategies/google.strategy';
import { FavouritesModule } from './modules/favourites.module';
import { TagModule } from './modules/add_tag.module';
import { HiddenUrlsModule } from './modules/hidden_urls.module';
//import { SeederService } from 'src/services/seeder.service';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const uri = config.get<string>('DB_HOST');
        console.log('📡 Connecting to MongoDB at:', uri);
        try {
          await mongoose.connect(uri as string);
          console.log('✅ Connected to MongoDB successfully!');
        } catch (error) {
          console.error('❌ Failed to connect to MongoDB:', error);
        }

        return { uri };
      },
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
    FavouritesModule,
    TagModule,
    HiddenUrlsModule
  ],
  controllers: [AppController],
  providers: [AppService, GoogleStrategy],
})
export class AppModule {
  constructor() {}
}
