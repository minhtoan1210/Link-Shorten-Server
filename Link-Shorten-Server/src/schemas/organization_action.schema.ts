import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
export type OrganizationActionDocument =
  mongoose.HydratedDocument<OrganizationAction>;
@Schema({ timestamps: true, collection: 'org_actions' })
export class OrganizationAction {
  @Prop({ required: true })
  name: string;
  //
  @Prop({ required: true, unique: true })
  short_code: string;
}
export const OrganizationActionSchema =
  SchemaFactory.createForClass(OrganizationAction);
