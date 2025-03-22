import {
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  Body,
  HttpException,
  UseGuards,
} from '@nestjs/common';
//
import { AuthGuard } from 'src/guards/auth.guard';
import { AdminGuard } from 'src/guards/admin.guard';
//
import { CurrencyService } from 'src/services/currency.service';
import { CurrencyDto, CurrencyUpdateDto } from 'src/dtos/currency.dto';
//
@Controller('currency')
@UseGuards(AuthGuard)
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  //#region GET Seeding
  @Get('seeding')
  @UseGuards(AdminGuard)
  async seeding(): Promise<any> {
    try {
      await this.currencyService.seed();
      let result = await this.currencyService.list();
      return {
        data: result,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  //#endregion

  //#region GET Get list currency
  @Get('list')
  async list(): Promise<any> {
    try {
      let result = await this.currencyService.list();
      return {
        data: result,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  //#endregion

  //#region GET Get one by id
  @Get(':id')
  async getById(@Param('id') id: string): Promise<any> {
    try {
      let result = await this.currencyService.getById(id);
      return {
        data: result,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  //#endregion

  //#region POST Create
  @Post()
  @UseGuards(AdminGuard)
  async create(@Body() body: CurrencyDto): Promise<any> {
    try {
      let result = await this.currencyService.create(body);
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
  @UseGuards(AdminGuard)
  async update(
    @Param('id') id: string,
    @Body() body: CurrencyUpdateDto,
  ): Promise<any> {
    try {
      let result = await this.currencyService.update(id, body);
      return {
        data: result,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  //#endregion

  //#region DELETE Delete by id
  @Delete(':id')
  @UseGuards(AdminGuard)
  async delete(@Param('id') id: string): Promise<any> {
    try {
      let result = await this.currencyService.delete(id);
      return {
        data: result,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  //#endregion
}
