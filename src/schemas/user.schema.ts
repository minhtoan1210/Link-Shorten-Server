import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
export type UserDocument = mongoose.HydratedDocument<User>;

@Schema({ timestamps: true, collection: 'users' })
export class User {
  @Prop()
  google_id?: string;
  //
  @Prop({ required: true })
  email: string;
  //
  @Prop({ required: true })
  fullname: string;
  //
  @Prop({ select: false })
  hashed_password: string;
  //
  @Prop()
  phone_number?: string;
  //
  @Prop({ type: String, enum: ['user', 'admin'], default: 'user' })
  type: string;
  //
  @Prop({ default: 0 })
  links: number;
  //
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Organization' }],
  })
  organizations: string[];
  //
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Organization' }],
  })
  organizations_joined?: string[];
  //
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }] })
  groups_joined?: string[];
}
export const UserSchema = SchemaFactory.createForClass(User);
