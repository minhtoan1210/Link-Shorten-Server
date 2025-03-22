import { IsOptional, IsString } from 'class-validator';
export class AddressDto {
  @IsString()
  country: string;
  //
  @IsOptional()
  @IsString()
  street: string;
  //
  @IsOptional()
  @IsString()
  apartment: string;
  //
  @IsOptional()
  @IsString()
  district: string;
  //
  @IsOptional()
  @IsString()
  city: string;
  //
  @IsOptional()
  @IsString()
  state: string;
  //
  @IsOptional()
  @IsString()
  province: string;
}
