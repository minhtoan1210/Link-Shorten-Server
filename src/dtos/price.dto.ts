import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class PriceDto {
  @IsNotEmpty({ message: 'Currency of price cannot be empty.' })
  @IsString({ message: 'Currency of price must be a text string.' })
  currency: string;
  //
  @IsNotEmpty({ message: 'Monthly price cannot be empty.' })
  @IsNumber({}, { message: 'Monthly price must be a number.' })
  monthly: number;
  //
  @IsNotEmpty({ message: 'Annually price cannot be empty.' })
  @IsNumber({}, { message: 'Annually price must be a number.' })
  annually: number;
}
