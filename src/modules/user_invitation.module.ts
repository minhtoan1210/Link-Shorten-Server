import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
//
import {
  UserInvitation,
  UserInvitationSchema,
} from 'src/schemas/user_invitation.schema';
import { UserInvitationController } from 'src/controllers/user_invitation.controller';
import { UserInvitationService } from 'src/services/user_invitation.service';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: UserInvitation.name,
        schema: UserInvitationSchema,
        collection: 'user_invitations',
      },
    ]),
  ],
  controllers: [UserInvitationController],
  providers: [UserInvitationService],
  exports: [MongooseModule, UserInvitationService],
})
export class UserInvitationModule {}
