import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

import { PriceDto } from 'src/dtos/price.dto';

export type PlanDocument = mongoose.HydratedDocument<Plan>;
@Schema({ timestamps: true, collection: 'plans' })
export class Plan {
  @Prop({ required: true })
  name: string;
  //
  @Prop()
  description: string;
  //
  @Prop({ default: 1000 })
  links_limit: number;
  //
  @Prop({ default: 10 })
  organizations_limit: number;
  //
  @Prop({ default: 100 })
  groups_limit: number;
  //
  @Prop({ type: [PriceDto] })
  prices: PriceDto[];
}
export const PlanSchema = SchemaFactory.createForClass(Plan);
