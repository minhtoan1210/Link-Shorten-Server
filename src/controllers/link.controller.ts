import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  HttpException,
  BadRequestException,
  Body,
  Query,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
//
import { AuthGuard } from 'src/guards/auth.guard';
import { AdminGuard } from 'src/guards/admin.guard';
//
import { UserDecorator } from 'src/decorators/user.decorator';
//
import { LinkCreateDto, LinkUpdateDto } from 'src/dtos/link.dto';
import { Pagination } from 'src/dtos/shared.dto';
//
import { LinkService } from 'src/services/link.service';
import { AuthService } from 'src/services/auth.service';
import { HttpService } from 'src/services/http.service';
//
import { Link } from 'src/schemas/link.schema';
import { UserRequestDto } from 'src/dtos/auth.dto';

@Controller('link')
export class LinkController {
  constructor(
    private readonly linkService: LinkService,
    private readonly authService: AuthService,
    private readonly httpService: HttpService,
  ) {}

  //#region GET Create shorten string
  @Get('create-shorten')
  async createNewShortenLink(): Promise<any> {
    try {
      let result = await this.linkService.generateShortenLink();
      return {
        data: result,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  //#endregion

  //#region GET Get all links in database
  @Get()
  @UseGuards(AuthGuard, AdminGuard)
  async list(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('date_order') date_order: string = 'desc',
  ): Promise<Pagination | any> {
    try {
      let count = await this.linkService.count();
      let pages =
        count % limit > 0 ? Math.floor(count / limit) + 1 : count / limit;
      let url = process.env.API_ENDPOINT + 'link';
      let links = await this.linkService.list(page, limit, date_order);
      if (pages == 1) {
        return {
          data: links,
          pages: pages,
          current: page,
          previous: null,
          next: null,
        };
      } else {
        return {
          data: links,
          total: count,
          pages: pages,
          current: page,
          previous:
            page == 1
              ? null
              : url + '?page=' + (Number(page) - 1) + '&limit=' + limit,
          next:
            page == pages
              ? null
              : url + '?page=' + (Number(page) + 1) + '&limit=' + limit,
        };
      }
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  //#region GET Get all links of request user
  @Get('my-links')
  @UseGuards(AuthGuard)
  async listByRequestUser(
    @UserDecorator() user: UserRequestDto,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('date_order') date_order: string = 'desc',
  ): Promise<Pagination | any> {
    try {
      let count = await this.linkService.count(user._id);
      let pages =
        count % limit > 0 ? Math.floor(count / limit) + 1 : count / limit;
      let url = process.env.API_ENDPOINT + 'link';
      let links = await this.linkService.listByUser(
        user._id,
        page,
        limit,
        date_order,
      );

      if (pages == 1) {
        return {
          data: links,
          total: count,
          pages: pages,
          previous: null,
          next: null,
        };
      } else {
        return {
          data: links,
          total: count,
          pages: pages,
          previous:
            page == 1
              ? null
              : url + '?page=' + (Number(page) - 1) + '&limit=' + limit,
          next:
            page == pages
              ? null
              : url + '?page=' + (Number(page) + 1) + '&limit=' + limit,
        };
      }
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  // #region GET Get all links of a user
  @Get('user/:id')
  @UseGuards(AuthGuard, AdminGuard)
  async listByUser(
    @Param('id') id: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('date_order') date_order: string = 'desc',
  ): Promise<Pagination | any> {
    try {
      let count = await this.linkService.count(id);
      let pages =
        count % limit > 0 ? Math.floor(count / limit) + 1 : count / limit;
      let url = process.env.API_ENDPOINT + 'link';
      let links = await this.linkService.listByUser(
        id,
        page,
        limit,
        date_order,
      );

      if (pages == 1) {
        return {
          data: links,
          total: count,
          pages: pages,
          previous: null,
          next: null,
        };
      } else {
        return {
          data: links,
          pages: pages,
          previous:
            page == 1
              ? null
              : url + '?page=' + (Number(page) - 1) + '&limit=' + limit,
          next:
            page == pages
              ? null
              : url + '?page=' + (Number(page) + 1) + '&limit=' + limit,
        };
      }
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  // #endregion

  //#region GET Get detail by id
  @Get('id/:id')
  @UseGuards(AuthGuard)
  async getById(
    @Param('id') id: string,
    @UserDecorator() user: UserRequestDto,
  ): Promise<any> {
    try {
      const is_admin = this.authService.isAdmin(user);
      let link = await this.linkService.getById(id);
      if (link == null) {
        throw new BadRequestException('Cannot find Link with _id ' + id + '.');
      }
      if (is_admin == false) {
        const is_owner = this.authService.isOwner(user._id, link);
        if (is_owner == false) {
          throw new BadRequestException(
            'You are not the owner to view Link with _id ' + id,
          );
        }
      }
      return {
        data: link,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  //#region GET Get detail by shorten
  @Get(':shorten')
  async getByShorten(
    @Param('shorten') shorten: string,
    @Query('nullable') nullable: string,
  ): Promise<any> {
    try {
      let result = await this.linkService.getByShorten(shorten);
      if (result != null) {
        return {
          data: result,
        };
      } else {
        if (Boolean(nullable) == true) {
          return {
            data: null,
          };
        } else {
          throw new NotFoundException(
            'Cannot find link with shorten ' + shorten,
          );
        }
      }
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  //#endregion

  //#region POST Create new
  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body() body: LinkCreateDto,
    @UserDecorator() user: UserRequestDto,
  ): Promise<any> {
    try {
      // Check if original used
      let document = await this.linkService.getByOriginal(body.original);
      if (document != null) {
        throw new BadRequestException(
          'The original link ' + body.original + ' is already created.',
        );
      }
      let shorten = await this.linkService.generateShortenLink();
      let new_body: any = body;
      new_body.shorten = shorten;
      new_body.favicon = this.httpService.getFavicon(body.original);
      document = await this.linkService.create(new_body, user);
      return {
        data: document,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  //#endregion

  //#region POST Get link by original
  @Post('get-by-original')
  @UseGuards(AuthGuard)
  async getByOriginal(@Body() body: { original: string }): Promise<any> {
    try {
      let document = await this.linkService.getByOriginal(body.original);
      return {
        data: document,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  //#endregion

  //#region PATCH Update link
  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(
    @Param('id') id: string,
    @Body() body: LinkUpdateDto,
    @UserDecorator() user: UserRequestDto,
  ): Promise<Link | any> {
    try {
      let link = await this.linkService.getById(id);
      if (link == null) {
        throw new BadRequestException('Cannot find Link with _id ' + id + '.');
      }
      const is_owner = this.authService.isOwner(user._id, link);

      if (is_owner == false) {
        throw new BadRequestException(
          'You are not the owner to update Link with _id ' + id,
        );
      } else {
        if (body.shorten) {
          let used = await this.linkService.isShortenUsed(body.shorten, id);
          if (used == true) {
            throw new BadRequestException(
              'Shorten is used. Please try another one.',
            );
          }
        }
        let updated = await this.linkService.update(id, body);

        return {
          data: updated,
        };
      }
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  //#endregion

  //#region DELETE Delete link
  @Delete(':id')
  @UseGuards(AuthGuard)
  async delete(@Param('id') id: string): Promise<any> {
    try {
      let link = await this.linkService.getById(id);
      if (link == null) {
        throw new BadRequestException('Cannot find link with _id ' + id);
      } else {
        await this.linkService.delete(id);
        return {
          data: true,
        };
      }
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  //#endregion
}
