import { IsOptional, IsNotEmpty, IsString } from 'class-validator';
export class CurrencyDto {
  @IsNotEmpty({ message: 'Name of currency cannot be empty.' })
  @IsString({ message: 'Name of currency must be text string.' })
  name: string;
  //
  @IsNotEmpty({ message: 'Value of currency cannot be empty.' })
  @IsString({ message: 'Value of currency must be text string.' })
  value: string;
}
export class CurrencyUpdateDto {
  @IsOptional()
  @IsNotEmpty({ message: 'Name of currency cannot be empty.' })
  @IsString({ message: 'Name of currency must be text string.' })
  name: string;
  //
  @IsOptional()
  @IsNotEmpty({ message: 'Value of currency cannot be empty.' })
  @IsString({ message: 'Value of currency must be text string.' })
  value: string;
}
