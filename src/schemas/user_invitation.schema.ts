import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
export type UserDocument = mongoose.HydratedDocument<UserInvitation>;

@Schema({ timestamps: true, collection: 'user_invitations' })
export class UserInvitation {
  @Prop({ required: true })
  email: string;
  //
  @Prop()
  organization?: string;
  //
  @Prop()
  role?: string;
  //
  @Prop()
  expiresAt: Date;
}
export const UserInvitationSchema =
  SchemaFactory.createForClass(UserInvitation);
