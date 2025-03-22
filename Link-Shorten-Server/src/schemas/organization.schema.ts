import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { AddressDto } from 'src/dtos/address.dto';
import { User } from 'src/schemas/user.schema';
export type OrganizationDocument = mongoose.HydratedDocument<Organization>;
@Schema({
  timestamps: true,
  collection: 'organizations',
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Organization {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  owner: User;
  //
  @Prop({ required: true })
  name: string;
  //
  @Prop({ unique: true })
  email: string;
  //
  @Prop()
  address: AddressDto;
  //
  @Prop()
  phone_number: string;
  //
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  users?: string[];
  //
  @Prop({ type: [String] })
  users_waiting?: string[];
}
export const OrganizationSchema = SchemaFactory.createForClass(Organization);
