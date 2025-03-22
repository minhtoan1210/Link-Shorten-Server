import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from 'src/schemas/user.schema';
export type LinkDocument = mongoose.HydratedDocument<Link>;
@Schema({
  timestamps: true,
  collection: 'links',
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Link {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
  //
  @Prop({ required: true })
  original: string;
  //
  @Prop({
    required: true,
    unique: true,
  })
  shorten: string;
  //
  @Prop({ default: false })
  active: boolean;
  //
  @Prop({ default: 0 })
  calls: number;
  //
  @Prop()
  favicon: string;
}
export const LinkSchema = SchemaFactory.createForClass(Link);
