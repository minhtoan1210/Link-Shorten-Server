import {
  IsOptional,
  IsNotEmpty,
  IsString,
  IsEmail,
  IsMongoId,
} from 'class-validator';
import { AddressDto } from 'src/dtos/address.dto';
//#region Organization
export class OrgCreateDto {
  @IsNotEmpty({ message: 'Name of organization cannot be empty.' })
  @IsString({ message: 'Name of organization must be a text string.' })
  name: string;
  //
  @IsOptional()
  @IsEmail({}, { message: 'Email of organization is invalid.' })
  email: string;
  //
  @IsOptional()
  address: AddressDto;
  //
  @IsOptional()
  phone_number: string;
}
//
export class OrgUpdateDto {
  @IsOptional()
  address: AddressDto;
  //
  @IsOptional()
  @IsNotEmpty({ message: 'Name of organization cannot be empty.' })
  @IsString({ message: 'Name of organization must be a text string.' })
  name: string;
  //
  @IsOptional()
  @IsEmail({}, { message: 'Email of organization is invalid.' })
  email: string;
  //
  @IsOptional()
  phone_number: string;
}

export class OrgUpdateUsersDto {
  @IsNotEmpty({ message: 'Users cannot be empty.' })
  users: string[];
}
//#endregion

//#region Organization Action
export class OrgActionCreateDto {
  @IsNotEmpty({ message: 'Name of action cannot be empty.' })
  @IsString({ message: 'Name of action must be a text string.' })
  name: string;
  //
  @IsNotEmpty({ message: 'Short code of action cannot be empty.' })
  @IsString({ message: 'Short code of action must be a text string.' })
  short_code: string;
}
//
export class OrgActionUpdateDto {
  @IsOptional()
  @IsNotEmpty({ message: 'Name of action cannot be empty.' })
  @IsString({ message: 'Name of action must be a text string.' })
  name: string;
  //
  @IsOptional()
  @IsNotEmpty({ message: 'Short code of action cannot be empty.' })
  @IsString({ message: 'Short code of action must be a text string.' })
  short_code: string;
}
//#endregion

//#region Organization Role
export class OrgRoleCreateDto {
  @IsNotEmpty({ message: 'Organization info cannot be empty.' })
  organization: string;
  //
  @IsNotEmpty({ message: 'Name of role cannot be empty.' })
  @IsString({ message: 'Name of role must be a text string.' })
  name: string;
  //
  @IsNotEmpty({ message: 'List action of role cannot be empty.' })
  actions: string[];
}
//
export class OrgRoleUpdateDto {
  @IsOptional()
  @IsNotEmpty({ message: 'Name of role cannot be empty.' })
  @IsString({ message: 'Name of role must be a text string.' })
  name: string;
  //
  @IsOptional()
  @IsNotEmpty({ message: 'List action of role cannot be empty.' })
  actions: string[];
}
//#endregion

//#region Organization Permission
export class OrgPermissionDto {
  @IsNotEmpty({ message: 'User cannot be empty.' })
  @IsMongoId({ message: 'User must be a valid ObjectId.' })
  user: string;
  //
  @IsNotEmpty({ message: 'Role cannot be empty.' })
  @IsMongoId({ message: 'Role must be a valid ObjectId.' })
  role: string;
  //
  @IsNotEmpty({ message: 'Organization cannot be empty.' })
  @IsMongoId({ message: 'Organization must be a valid ObjectId.' })
  organization: string;
}
//#endregion
