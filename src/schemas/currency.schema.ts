import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
export type CurrencyDocument = mongoose.HydratedDocument<Currency>;
@Schema({ timestamps: true, collection: 'currencies ' })
export class Currency {
  @Prop()
  name: string;
  //
  @Prop({ unique: true })
  value: string;
}
export const CurrencySchema = SchemaFactory.createForClass(Currency);
