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
import { HiddenUrlsService } from 'src/services/hidden_urls.service';

@Controller('hidden_urls')
@UseGuards(AuthGuard)
export class HiddenUrlsController {
  constructor(private readonly hiddenUrlsService: HiddenUrlsService) {}

  @Patch('add-hidden-link')
  async removeHiddenUrls(
    @UserDecorator() user: UserRequestDto,
    @Body() body: FavouritesUpdateUsersDto,
  ) {
    try {
      let result = await this.hiddenUrlsService.addHiddenLink(user, body);

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

  @Get('get-list-hidden-urls')
  async getListHiddenUrls(@UserDecorator() user: UserRequestDto) {
    try {
      const result = await this.hiddenUrlsService.getListHidden(user);
      return result;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
