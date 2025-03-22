import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  HttpException,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
//
import { AuthGuard } from 'src/guards/auth.guard';
import { AdminGuard } from 'src/guards/admin.guard';
import { UserDecorator } from 'src/decorators/user.decorator';
import { caculatePages } from 'src/utils/helper';
//
import { OrganizationService } from 'src/services/organization.service';
import {
  OrgCreateDto,
  OrgUpdateDto,
  OrgUpdateUsersDto,
} from 'src/dtos/organization.dto';
//
@Controller('organization')
@UseGuards(AuthGuard)
export class OrganizationController {
  constructor(private readonly orgService: OrganizationService) {}

  //#region GET List
  @Get()
  @UseGuards(AdminGuard)
  async list(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('date_order') date_order: string = 'desc',
  ): Promise<any> {
    try {
      let count = await this.orgService.count();
      let pages = caculatePages(count, limit);
      let url = process.env.API_ENDPOINT + 'organization';
      let orgs = await this.orgService.list(page, limit, date_order);

      if (pages == 1) {
        return {
          data: orgs,
          total: count,
          pages: pages,
          current: page,
          previous: null,
          next: null,
        };
      } else {
        return {
          data: orgs,
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

  //#region GET List of my organization
  @Get('my-organizations')
  async mine(
    @UserDecorator() user: any,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('date_order') date_order: string = 'desc',
  ) {
    try {
      let count = await this.orgService.countMine(user._id);
      let pages = caculatePages(count, limit);
      let url = process.env.API_ENDPOINT + 'organization/my-organizations';
      let orgs = await this.orgService.listByOwner(
        user._id,
        page,
        limit,
        date_order,
      );
      if (pages == 1) {
        return {
          data: orgs,
          total: count,
          pages: pages,
          current: page,
          previous: null,
          next: null,
        };
      } else {
        return {
          data: orgs,
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

  //#region GET Get by id
  @Get(':id')
  async getById(
    @Param('id') id: string,
    @UserDecorator() user: any,
  ): Promise<any> {
    try {
      let org = await this.orgService.getById(id);
      if (user.type == 'admin' || user._id == org.owner) {
        return {
          data: org,
        };
      } else {
        throw new BadRequestException(
          "You are not the owner or don't have permission to view this organization information.",
        );
      }
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  //#endregion

  //#region POST Create
  @Post()
  async create(
    @Body() body: OrgCreateDto,
    @UserDecorator() user: any,
  ): Promise<any> {
    try {
      if (body.email) {
        let existed = await this.orgService.getByEmail(body.email);
        if (existed) {
          throw new BadRequestException(
            'Email ' +
              body.email +
              ' is already used by another organization. Please choose a different email.',
          );
        }
      }
      let org = await this.orgService.create(body, user._id);
      return {
        data: org,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  //#endregion

  //#region PATCH Add user
  @Patch('add-user/:id')
  async addUser(
    @Param('id') id: string,
    @Body() body: OrgUpdateUsersDto,
  ): Promise<any> {
    try {
      let result = await this.orgService.addUser(id, body);
      return {
        data: result,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  //#endregion

  //#region PATCH Remove user
  @Patch('remove-user/:id')
  async removeUser(
    @Param('id') id: string,
    @Body() body: { user: string },
  ): Promise<any> {
    try {
      let result = await this.orgService.removeUser(id, body.user);
      return {
        data: result,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  //#endregion

  //#region GET List user in organization
  @Get('users/:id')
  async listUser(
    @Param('id') id: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('date_order') date_order: string = 'desc',
  ): Promise<any> {
    try {
      let count = await this.orgService.countUsers(id);
      let pages = caculatePages(count, limit);
      let url = process.env.API_ENDPOINT + 'organization/users/' + id;
      let users = await this.orgService.getUsers(id, page, limit, date_order);
      if (pages == 1) {
        return {
          data: users,
          total: count,
          pages: pages,
          current: page,
          previous: null,
          next: null,
        };
      } else {
        return {
          data: users,
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

  //#region PATCH Update
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: OrgUpdateDto,
    @UserDecorator() user: any,
  ): Promise<any> {
    try {
      let isOwner = await this.orgService.isOwner(id, user._id);
      if (isOwner == false) {
        throw new BadRequestException(
          "You are not the owner or don't have permission to update this organization information.",
        );
      }

      if (body.email) {
        let existed = await this.orgService.getByEmail(body.email);
        if (existed && existed._id.toString() !== id) {
          throw new BadRequestException(
            'Email ' +
              body.email +
              ' is already used by another organization. Please choose a different email.',
          );
        }
      }

      let org = await this.orgService.update(id, body);
      return {
        data: org,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  //#endregion

  //#region DELETE Delete
  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @UserDecorator() user: any,
  ): Promise<any> {
    try {
      let isOwner = await this.orgService.isOwner(id, user._id);
      if (isOwner == false) {
        throw new BadRequestException(
          "You are not the owner or don't have permission to delete this organization.",
        );
      } else {
        let result = await this.orgService.delete(id);
        return {
          data: result,
        };
      }
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  //#endregion
}
