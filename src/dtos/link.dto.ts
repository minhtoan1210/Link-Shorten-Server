import { IsOptional, IsNotEmpty, IsString } from 'class-validator';

export class LinkCreateDto {
  @IsNotEmpty({ message: 'Original link cannot be empty.' })
  @IsString({ message: 'Original link must be a valid string.' })
  original: string;
}

export class LinkUpdateDto {
  @IsOptional()
  @IsString({ message: 'Original link must be a valid string.' })
  original?: string;
  //
  @IsOptional()
  shorten?: string;
  //
  @IsOptional()
  active: boolean;
}
