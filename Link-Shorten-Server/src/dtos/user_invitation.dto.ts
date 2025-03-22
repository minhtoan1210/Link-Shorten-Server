import { IsNotEmpty, IsEmail, IsOptional, IsMongoId } from 'class-validator';
export class UserInvitationCreateDto {
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
  @IsMongoId({ message: 'Invalid organization id.' })
  organization: string;
  //
  @IsOptional()
  @IsMongoId({ message: 'Invalid role id.' })
  role?: string;
}
