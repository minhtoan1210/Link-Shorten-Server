import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
//
import { UserModule } from 'src/modules/user.module';
import { GuardModule } from 'src/modules/guard.module';
import { GroupModule } from 'src/modules/group.module';
import { UserInvitationModule } from 'src/modules/user_invitation.module';
//
import {
  Organization,
  OrganizationSchema,
} from 'src/schemas/organization.schema';
import { OrganizationController } from 'src/controllers/organization.controller';
import { OrganizationService } from 'src/services/organization.service';
@Module({
  imports: [
    GuardModule,
    UserInvitationModule,
    forwardRef(() => UserModule),
    forwardRef(() => GroupModule),
    MongooseModule.forFeature([
      {
        name: Organization.name,
        schema: OrganizationSchema,
        collection: 'organizations',
      },
    ]),
  ],
  controllers: [OrganizationController],
  providers: [OrganizationService],
  exports: [MongooseModule, OrganizationService],
})
export class OrganizationModule {}
