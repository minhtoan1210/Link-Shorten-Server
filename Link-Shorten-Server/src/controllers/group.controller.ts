import {
  Controller,
  Get,
  Post,
  Patch,
  Query,
  Delete,
  Body,
  Param,
  HttpException,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
//
import { AuthGuard } from 'src/guards/auth.guard';
import { AdminGuard } from 'src/guards/admin.guard';
import { GroupService } from 'src/services/group.service';
import { OrganizationService } from 'src/services/organization.service';
import { UserDecorator } from 'src/decorators/user.decorator';
import {
  GroupUpdateUsersDto,
  GroupUpdateDto,
  GroupCreateDto,
} from 'src/dtos/group.dto';
import { caculatePages } from 'src/utils/helper';

@Controller('group')
@UseGuards(AuthGuard)
export class GroupController {
  constructor(
    private readonly groupService: GroupService,
    private readonly orgService: OrganizationService,
  ) {}

  //#region GET List all groups in database
  @Get('')
  @UseGuards(AdminGuard)
  async list(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('date_order') date_order: string = 'desc',
  ): Promise<any> {
    try {
      let count = await this.groupService.count();
      let pages = caculatePages(count, limit);
      let url = process.env.API_ENDPOINT + 'group';
      let groups = await this.groupService.list(page, limit, date_order);
      if (pages == 1) {
        return {
          data: groups,
          pages: pages,
          current: page,
          previous: null,
          next: null,
        };
      } else {
        return {
          data: groups,
          total: count,
          pages: pages,
          current: page,
          previous:
            page == 1
              ? null
              : url +
                '?page=' +
                (Number(page) - 1) +
                '&limit=' +
                limit +
                '&date_order=' +
                date_order,
          next:
            page == pages
              ? null
              : url +
                '?page=' +
                (Number(page) + 1) +
                '&limit=' +
                limit +
                '&date_order=' +
                date_order,
        };
      }
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  //#endregion

  //#region GET Get list group of organization
  @Get('org/:id')
  async listOfOrganization(
    @Param('id') id: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('date_order') date_order: string = 'desc',
  ): Promise<any> {
    try {
      let count = await this.groupService.count();
      let pages = caculatePages(count, limit);
      let url = process.env.API_ENDPOINT + 'group/org/' + id;
      let groups = await this.groupService.listOfOrganization(
        id,
        page,
        limit,
        date_order,
      );

      if (pages == 1) {
        return {
          data: groups,
          total: count,
          pages: pages,
          previous: null,
          next: null,
        };
      } else {
        return {
          data: groups,
          total: count,
          pages: pages,
          previous:
            page == 1
              ? null
              : url +
                '?page=' +
                (Number(page) - 1) +
                '&limit=' +
                limit +
                '&date_order=' +
                date_order,
          next:
            page == pages
              ? null
              : url +
                '?page=' +
                (Number(page) + 1) +
                '&limit=' +
                limit +
                '&date_order=' +
                date_order,
        };
      }
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  //#endregion

  //#region GET owned
  @Get('owned')
  async owned(
    @UserDecorator() user: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('date_order') date_order: string = 'desc',
  ) {
    try {
      let count = await this.groupService.countOwned(user._id);
      let pages = caculatePages(count, limit);
      let url = process.env.API_ENDPOINT + 'group/owned';
      let groups = await this.groupService.owned(
        user._id,
        page,
        limit,
        date_order,
      );
      if (pages == 1) {
        return {
          data: groups,
          total: count,
          pages: pages,
          previous: null,
          next: null,
        };
      } else {
        return {
          data: groups,
          total: count,
          pages: pages,
          previous:
            page == 1
              ? null
              : url +
                '?page=' +
                (Number(page) - 1) +
                '&limit=' +
                limit +
                '&date_order=' +
                date_order,
          next:
            page == pages
              ? null
              : url +
                '?page=' +
                (Number(page) + 1) +
                '&limit=' +
                limit +
                '&date_order=' +
                date_order,
        };
      }
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  //#endregion

  //#region GET joined
  @Get('joined')
  async joined(
    @UserDecorator() user: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('date_order') date_order: string = 'desc',
  ): Promise<any> {
    try {
      let count = await this.groupService.countJoined(user._id);
      let pages = caculatePages(count, limit);
      let url = process.env.API_ENDPOINT + 'group/joined';
      let groups = await this.groupService.joined(
        user._id,
        page,
        limit,
        date_order,
      );
      if (pages == 1) {
        return {
          data: groups,
          total: count,
          pages: pages,
          previous: null,
          next: null,
        };
      } else {
        return {
          data: groups,
          total: count,
          pages: pages,
          previous:
            page == 1
              ? null
              : url +
                '?page=' +
                (Number(page) - 1) +
                '&limit=' +
                limit +
                '&date_order=' +
                date_order,
          next:
            page == pages
              ? null
              : url +
                '?page=' +
                (Number(page) + 1) +
                '&limit=' +
                limit +
                '&date_order=' +
                date_order,
        };
      }
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  //#endregion

  //#region GET getById
  @Get(':id')
  async getById(@Param('id') id: string): Promise<any> {
    try {
      let group = await this.groupService.getById(id);
      return {
        data: group,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  //#endregion

  //#region POST create
  @Post()
  async create(
    @Body() body: GroupCreateDto,
    @UserDecorator() user: any,
  ): Promise<any> {
    try {
      let isOrgOwner = await this.orgService.isOwner(
        body.organization,
        user._id,
      );
      if (isOrgOwner == true) {
        let group = await this.groupService.create(body);
        return {
          data: group,
        };
      } else {
        throw new BadRequestException(
          "You don't have permission to create new group in this organization.",
        );
      }
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  //#endregion

  //#region PATCH Add user
  @Patch('add-users/:id')
  async addUsers(
    @Param('id') id: string,
    @Body()
    body: GroupUpdateUsersDto,
  ) {
    try {
      let result = await this.groupService.addUsers(id, body);
      return {
        data: result,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  //#endregion

  //#region PATCH Remove user
  @Patch('remove-users/:id')
  async removeUsers(
    @Param('id') id: string,
    @Body()
    body: GroupUpdateUsersDto,
  ) {
    try {
      let result = await this.groupService.removeUsers(id, body);
      return {
        data: result,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  //#endregion

  //#region PATCH Update
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: GroupUpdateDto,
  ): Promise<any> {
    try {
      let group = await this.groupService.update(id, body);
      return {
        data: group,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  //#endregion

  //#region DELETE Delete
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<any> {
    try {
      let result = await this.groupService.delete(id);
      return {
        data: result,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  //#endregion
}
