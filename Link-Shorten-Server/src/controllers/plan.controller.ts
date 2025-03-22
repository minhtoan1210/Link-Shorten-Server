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
import { PlanService } from 'src/services/plan.service';
import { PlanCreateDto, PlanUpdateDto } from 'src/dtos/plan.dto';
//
@Controller('plan')
@UseGuards(AuthGuard)
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  //#region GET List
  @Get()
  async list(): Promise<any> {
    try {
      let plans = await this.planService.list();
      return {
        data: plans,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  //#endregion

  //#region GET Get by id
  @Get(':id')
  async getById(@Param('id') id: string): Promise<any> {
    try {
      let plan = await this.planService.getById(id);
      return {
        data: plan,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  //#endregion

  //#region POST Create new plan
  @Post()
  @UseGuards(AdminGuard)
  async create(@Body() body: PlanCreateDto): Promise<any> {
    try {
      let plan = await this.planService.create(body);
      return {
        data: plan,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  //#endregion

  //#region PATCH Update plan
  @Patch(':id')
  @UseGuards(AdminGuard)
  async update(
    @Param('id') id: string,
    @Body() body: PlanUpdateDto,
  ): Promise<any> {
    try {
      let plan = await this.planService.update(id, body);
      return {
        data: plan,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  //#endregion

  //#region DELETE Delete plan
  @Delete(':id')
  @UseGuards(AdminGuard)
  async delete(@Param('id') id: string): Promise<any> {
    try {
      let result = await this.planService.delete(id);
      return {
        data: result,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  //#endregion
}
