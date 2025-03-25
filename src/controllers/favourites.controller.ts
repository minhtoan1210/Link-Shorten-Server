import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpException,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UserDecorator } from 'src/decorators/user.decorator';
import { UserRequestDto } from 'src/dtos/auth.dto';
import { FavouritesUpdateUsersDto } from 'src/dtos/favourites.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { FavouritesService } from 'src/services/favourites.service';


@Controller('favourites')
@UseGuards(AuthGuard)
export class FavouritesController {
  constructor(private readonly favouritesService: FavouritesService) {}
  @Patch('add-favourites')
  async addFavourites(
    @UserDecorator() user: UserRequestDto,
    @Body() body: FavouritesUpdateUsersDto,
  ) {
    try {
      let result = await this.favouritesService.addListFavourites(user, body);

      if (result === 0) {
        throw new BadRequestException('Không tìm thấy nào để cập nhật!');
      } else {
        return {
          status: 200,
          message: 'Thêm thành công',
        };
      }
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Patch('remove-favourites')
  async removeFavourites(
    @UserDecorator() user: UserRequestDto,
    @Body() body: FavouritesUpdateUsersDto,
  ) {
    try {
      let result = await this.favouritesService.removeListFavourites(
        user,
        body,
      );

      if (result === 0) {
        throw new BadRequestException('Không tìm thấy nào để cập nhật!');
      } else {
        return {
          status: 200,
          message: 'Thêm thành công',
        };
      }
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get('get-list-favourites')
  async getListFavourites(@UserDecorator() user: UserRequestDto) {
    try {
      let result = await this.favouritesService.getListFavourites(user);
      return result ? { data: result } : [];
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
