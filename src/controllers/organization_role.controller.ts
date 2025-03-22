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
//
import { OrgRoleCreateDto, OrgRoleUpdateDto } from 'src/dtos/organization.dto';
import { OrganizationRoleService } from 'src/services/organization_role.service';
@Controller('org-role')
@UseGuards(AuthGuard)
export class OrganizationRoleController {
  constructor(private readonly roleService: OrganizationRoleService) {}

  //#region GET Get list of organization role
  @Get('org/:id')
  async list(@Param('id') id: string): Promise<any> {
    try {
      let roles = await this.roleService.list(id);
      return {
        data: roles,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  //#ednregion

  //#region GET Get single role by id
  @Get(':id')
  async getById(@Param('id') id: string): Promise<any> {
    try {
      let role = await this.roleService.getById(id);
      return {
        data: role,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  //#endregion

  //#region POST Create new organization role
  @Post()
  async create(@Body() body: OrgRoleCreateDto): Promise<any> {
    try {
      let role = await this.roleService.create(body);
      return {
        data: role,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  //#endregion

  //#region PATCH Update an organization role
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: OrgRoleUpdateDto,
  ): Promise<any> {
    try {
      let role = await this.roleService.update(id, body);
      return {
        data: role,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  //#endregion

  //#region DELETE Delete an organization role
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<any> {
    try {
      let role = await this.roleService.delete(id);
      return {
        data: role,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  //#endregion
}
