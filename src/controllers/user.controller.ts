import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  BadRequestException,
  HttpException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
//
import { UserCreateDto, UserUpdateDto } from 'src/dtos/user.dto';
import { Pagination } from 'src/dtos/shared.dto';
//
import { UserService } from 'src/services/user.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserDecorator } from 'src/decorators/user.decorator';
import { UserRequestDto } from 'src/dtos/auth.dto';
import { AdminGuard } from 'src/guards/admin.guard';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  //#region GET Get list user

  @UseGuards(AuthGuard, AdminGuard)
  @Get()
  async list(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('date_order') date_order: string = 'desc',
  ): Promise<Pagination | any> {
    try {
      let count = await this.userService.count();
      let pages =
        count % limit > 0 ? Math.floor(count / limit) + 1 : count / limit;
      let url = process.env.API_ENDPOINT + 'user';
      let documents = await this.userService.list(
        Number(page),
        limit,
        date_order,
      );
      let response = new Pagination();
      response.data = documents;
      response.current = Number(page);
      response.pages = pages;
      if (page > 1) {
        response.previous =
          url + '?page=' + (Number(page) - 1) + '&limit=' + limit;
      }
      if (page < pages) {
        response.next = url + '?page=' + (Number(page) + 1) + '&limit=' + limit;
      }
      return response;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  //#endregion

  //#region GET Get by email
  @UseGuards(AuthGuard, AdminGuard)
  @Get('get-by-email/:email')
  async findByEmail(@Param('email') email: string): Promise<any> {
    try {
      let document = await this.userService.findByEmail(email);
      if (document == null) {
        throw new NotFoundException(
          'There is no user with email ' + email + '.',
        );
      } else {
        return {
          data: document,
        };
      }
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  //#endregion

  //#region GET Get by id
  @UseGuards(AuthGuard)
  @Get(':id')
  async findById(@Param('id') id: string): Promise<any> {
    try {
      let document = await this.userService.findById(id);
      if (document == null) {
        throw new NotFoundException('There is no user with _id ' + id);
      } else {
        return {
          data: document,
        };
      }
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  //#endregion

  //#region POST Create new user
  @Post()
  async create(@Body() body: UserCreateDto): Promise<any> {
    try {
      if (!body) {
        throw new BadRequestException('Invalid request body.');
      } else {
        let isEmailRegistered = await this.userService.isEmailRegistered(
          body.email,
        );
        if (isEmailRegistered == true) {
          throw new BadRequestException('Email already registered.');
        }
        let document = await this.userService.create(body);
        return {
          data: document,
        };
      }
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  //#endregion

  //#region PATCH Update user
  @UseGuards(AuthGuard)
  @Patch()
  async update(
    @Body() body: UserUpdateDto,
    @UserDecorator() user: UserRequestDto,
  ): Promise<any> {
    try {
      if (!body) {
        throw new BadRequestException('Invalid request body.');
      }
      if (body.new_password && body.new_password != body.confirm_new_password) {
        throw new BadRequestException(
          'Confirm new password must matched with new password.',
        );
      }
      let document = await this.userService.update(user._id, body);
      return {
        data: document,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  //#endregion

  //#region DELETE Delete user
  @UseGuards(AuthGuard, AdminGuard)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<any> {
    try {
      let document = await this.userService.findById(id);
      if (document == null) {
        throw new BadRequestException('Cannot find user with _id ' + id + '.');
      } else {
        await this.userService.delete(id);
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
