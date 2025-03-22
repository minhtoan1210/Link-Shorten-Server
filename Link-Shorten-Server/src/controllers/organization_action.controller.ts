import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  HttpException,
  UseGuards,
} from '@nestjs/common';
//
import { AuthGuard } from 'src/guards/auth.guard';
import { AdminGuard } from 'src/guards/admin.guard';
//
import {
  OrgActionCreateDto,
  OrgActionUpdateDto,
} from 'src/dtos/organization.dto';
import { OrganizationActionService } from 'src/services/organization_action.service';

@Controller('org-action')
@UseGuards(AuthGuard)
export class OrganizationActionController {
  constructor(private readonly actionService: OrganizationActionService) {}

  //#region GET Get list of organization action
  @Get()
  async list(): Promise<any> {
    try {
      let actions = await this.actionService.list();
      return {
        data: actions,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  //#ednregion

  //#region GET Get single action by id
  @Get(':id')
  async getById(@Param('id') id: string): Promise<any> {
    try {
      let action = await this.actionService.getById(id);
      return {
        data: action,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  //#endregion

  //#region POST Create new organization action
  @Post()
  @UseGuards(AdminGuard)
  async create(@Body() body: OrgActionCreateDto): Promise<any> {
    try {
      let action = await this.actionService.create(body);
      return {
        data: action,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  //#endregion

  //#region PATCH Update an organization action
  @Patch(':id')
  @UseGuards(AdminGuard)
  async update(
    @Param('id') id: string,
    @Body() body: OrgActionUpdateDto,
  ): Promise<any> {
    try {
      let action = await this.actionService.update(id, body);
      return {
        data: action,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  //#endregion

  //#region DELETE Delete an organization action
  @Delete(':id')
  @UseGuards(AdminGuard)
  async delete(@Param('id') id: string): Promise<any> {
    try {
      let action = await this.actionService.delete(id);
      return {
        data: action,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  //#endregion
}
