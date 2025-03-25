import { IsArray } from "class-validator";

export class FavouritesUpdateUsersDto {
  @IsArray({ message: 'favourites add to group must be wrapped in array' })
  favourites: [string];
}
