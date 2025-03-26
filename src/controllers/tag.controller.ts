import { Controller, Get, HttpException, UseGuards } from '@nestjs/common';
import { UserDecorator } from 'src/decorators/user.decorator';
import { UserRequestDto } from 'src/dtos/auth.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { TagService } from 'src/services/tag.service';

@Controller('tag')
@UseGuards(AuthGuard)
export class TagController {
  constructor(private readonly addTagService: TagService) {}

  @Get('get-list-tag')
  async getListTag(@UserDecorator() user: UserRequestDto) {
    try {
        const result = await this.addTagService.getListAddTag(user)
        return result.map((item) => ({
          ...item, 
          shorten: `${process.env.API_ENDPOINT}/${item.shorten}`,
        }));
    }
    catch( error ) {
      throw new HttpException(error.message, error.status);
    }
  }
}
