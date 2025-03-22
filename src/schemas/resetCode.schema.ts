import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type ResetCodeDocument = mongoose.HydratedDocument<ResetCode>;

@Schema({ timestamps: true, collection: 'reset_codes' })
export class ResetCode {
  @Prop({ required: true })
  email: string;
  @Prop({ required: true })
  value: string;
  @Prop({ required: true })
  expiresAt: Date;
}
export const ResetCodeSchema = SchemaFactory.createForClass(ResetCode);
