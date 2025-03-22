import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PriceDto } from './price.dto';
export class PlanCreateDto {
  @IsNotEmpty({ message: 'Name of plan cannot be empty.' })
  @IsString({ message: 'Name of plan must be text string.' })
  name: string;
  //
  @IsOptional()
  description: string;
  //
  @IsNotEmpty({ message: 'Organizations limit of plan cannot be empty.' })
  @IsNumber(
    {},
    { message: 'Organizations limit of plan must be a valid number.' },
  )
  organizations_limit: number;
  //
  @IsNotEmpty({ message: 'Groups limit of plan cannot be empty.' })
  @IsNumber({}, { message: 'Groups limit of plan must be a valid number.' })
  groups_limit: number;
  //
  @IsNotEmpty({ message: 'Links limit of plan cannot be empty.' })
  @IsNumber({}, { message: 'Links limit of plan must be a valid number.' })
  links_limit: number;
  //
  @IsArray({ message: 'Prices of plan cannot be empty.' })
  prices: PriceDto[];
}
export class PlanUpdateDto {
  @IsOptional()
  @IsNotEmpty({ message: 'Name of plan cannot be empty.' })
  @IsString({ message: 'Name of plan must be text string.' })
  name: string;
  //
  @IsOptional()
  description: string;
  //
  @IsOptional()
  @IsNotEmpty({ message: 'Organizations limit of plan cannot be empty.' })
  @IsNumber(
    {},
    { message: 'Organizations limit of plan must be a valid number.' },
  )
  organizations_limit: number;
  //
  @IsOptional()
  @IsNotEmpty({ message: 'Groups limit of plan cannot be empty.' })
  @IsNumber({}, { message: 'Groups limit of plan must be a valid number.' })
  groups_limit: number;
  //
  @IsOptional()
  @IsNotEmpty({ message: 'Links limit of plan cannot be empty.' })
  @IsNumber({}, { message: 'Links limit of plan must be a valid number.' })
  links_limit: number;
  //
  @IsOptional()
  @IsArray({ message: 'Prices of plan cannot be empty.' })
  prices: PriceDto[];
}
