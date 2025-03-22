import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { IpLocationDto } from 'src/dtos/ipLocation.dto';

export type TokenDocument = mongoose.HydratedDocument<Token>;

@Schema({ timestamps: true, collection: 'tokens' })
export class Token {
  @Prop()
  value: string;
  @Prop()
  ip: string;
  @Prop({
    default: 'access',
  })
  type?: string; // access | refresh
  @Prop()
  location?: IpLocationDto;
}
export const TokenSchema = SchemaFactory.createForClass(Token);
