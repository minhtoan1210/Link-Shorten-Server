import {
  IsOptional,
  IsNotEmpty,
  IsString,
  IsArray,
  IsMongoId,
} from 'class-validator';
export class GroupCreateDto {
  @IsNotEmpty({ message: 'Name of group cannot be empty.' })
  @IsString({ message: 'Name of group must be a text string.' })
  name: string;
  //
  @IsOptional()
  users?: [string];
  //
  @IsMongoId({ message: 'Invalid owner id.' })
  owner: string;
  //
  @IsMongoId({ message: 'Invalid organization id.' })
  organization: string;
}
//
export class GroupUpdateDto {
  @IsOptional()
  @IsString({ message: 'Name of group must be a text string.' })
  name?: string;
  //
  @IsOptional()
  @IsMongoId({ message: "Invalid owner's id." })
  owner?: string;
  //
  @IsOptional()
  users?: [string];
}
//
export class GroupUpdateUsersDto {
  @IsArray({ message: 'Users add to group must be wrapped in array' })
  users: [string];
}
