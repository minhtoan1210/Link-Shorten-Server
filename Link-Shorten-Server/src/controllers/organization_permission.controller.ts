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
import { OrgPermissionDto } from 'src/dtos/organization.dto';
//
import { AuthGuard } from 'src/guards/auth.guard';
//
import { OrganizationPermissionService } from 'src/services/organization_permission.service';
@Controller('org-permission')
@UseGuards(AuthGuard)
export class OrganizationPermissionController {
  constructor(
    private readonly permissionService: OrganizationPermissionService,
  ) {}

  //#region POST Set permission
  @Post('set')
  async set(@Body() body: OrgPermissionDto) {
    try {
      let result = await this.permissionService.updateOrCreate(body);
      return {
        data: result,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  //#endregion

  //#region DELETE Remove permission
  @Delete('remove')
  async remove(@Body() body: { user: string; organization: string }) {
    try {
      let deleted = await this.permissionService.remove(body);
      return {
        data: deleted,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  //#endregion
}
