import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { Organization } from 'src/schemas/organization.schema';
export type GroupDocument = mongoose.HydratedDocument<Group>;

@Schema({ timestamps: true, collection: 'groups' })
export class Group {
  @Prop({ required: true })
  name: string;
  //
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  owner: string;
  //
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
  })
  organization: string;
  //
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  users: string[];
}
export const GroupSchema = SchemaFactory.createForClass(Group);
