import {
  IsNotEmpty,
  IsEmail,
  IsOptional,
  ValidateIf,
  IsMongoId,
} from 'class-validator';
export class UserCreateDto {
  @IsEmail(
    {
      allow_utf8_local_part: true,
      ignore_max_length: true,
    },
    { message: 'Invalid email.' },
  )
  email: string;
  //
  @IsNotEmpty({ message: 'Full name cannot be empty.' })
  fullname: string;
  //
  @IsNotEmpty({ message: 'Password cannbot be empty.' })
  password: string;
  //
  @IsNotEmpty({ message: 'Confirm password cannot be empty.' })
  confirm_password: string;
  //
  @IsOptional()
  google_id?: string;
  //
  @IsOptional()
  phone_number?: string;
}
//
export class UserUpdateDto {
  @IsOptional()
  @IsEmail(
    {
      allow_utf8_local_part: true,
      ignore_max_length: true,
    },
    { message: 'Invalid email.' },
  )
  email?: string;
  //
  @IsOptional()
  fullname?: string;
  //
  @IsOptional()
  new_password?: string;
  //
  @ValidateIf((o) => o.new_password != null)
  @IsNotEmpty({ message: 'Confirm new password cannot be empty.' })
  confirm_new_password?: string;
  //
  @IsOptional()
  phone_number?: string;
}
//
export class UserCreateWithInvitationDto {
  @IsNotEmpty({ message: 'Invitation cannot be empty.' })
  @IsMongoId({ message: "Invalid invitation's id." })
  invitation: string;
  //
  @IsEmail(
    {
      allow_utf8_local_part: true,
      ignore_max_length: true,
    },
    { message: 'Invalid email.' },
  )
  email: string;
  //
  @IsNotEmpty({ message: 'Organization cannot be empty.' })
  organization: string;
  //
  @IsNotEmpty({ message: 'Full name cannot be empty.' })
  fullname: string;
  //
  @IsNotEmpty({ message: 'Password cannot be empty.' })
  password: string;
  //
  @IsNotEmpty({ message: 'Confirm password cannot be empty.' })
  confirm_new_password: string;
  //
  @IsOptional()
  @IsMongoId({ message: "Invalid role's id." })
  role?: string;
}
