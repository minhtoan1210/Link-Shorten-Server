import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
//
import { GuardModule } from 'src/modules/guard.module';
import { OrganizationModule } from 'src/modules/organization.module';
import { UserInvitationModule } from 'src/modules/user_invitation.module';
import { User, UserSchema } from 'src/schemas/user.schema';
import { UserService } from 'src/services/user.service';
import { UserController } from 'src/controllers/user.controller';
@Module({
  imports: [
    GuardModule,
    UserInvitationModule,
    forwardRef(() => OrganizationModule),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema, collection: 'users' },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [MongooseModule, UserService],
})
export class UserModule {}
