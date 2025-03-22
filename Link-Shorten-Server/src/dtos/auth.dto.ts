import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class AuthLoginDto {
  @IsEmail()
  email: string;
  @IsString()
  password: string;
  @IsOptional()
  remember?: boolean = false;
}
export class AuthTokenDto {
  access_token: string;
  refresh_token: string;
  access_expires_in?: number;
  access_expires_at?: Date;
  refresh_expires_in?: number;
  refresh_expires_at?: Date;
}
export class UserRequestDto {
  _id: string;
  email: string;
  fullname: string;
  type: string;
}

export class TokenPayloadDto {
  user: UserRequestDto;
  permission?: {
    organization: { name: string };
    role: { name: string };
    actions: string[];
  }[];
}
export class ResetPasswordDto {
  @IsNotEmpty({ message: 'Reset code cannot be empty.' })
  code: string;
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
  @IsNotEmpty({ message: 'New password cannot be empty.' })
  new_password: string;
  //
  @IsNotEmpty({ message: 'Please confirm new password.' })
  confirm_new_password: string;
}
