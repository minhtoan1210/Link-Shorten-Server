import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { OrgPermissionDto } from 'src/dtos/organization.dto';
import { OrganizationPermission } from 'src/schemas/organization_permission.schema';
import { OrganizationRole } from 'src/schemas/organization_role.schema';
@Injectable()
export class OrganizationPermissionService {
  constructor(
    @InjectModel('OrganizationPermission')
    private permissionlModel: mongoose.Model<OrganizationPermission>,
    @InjectModel('OrganizationRole')
    private roleModel: mongoose.Model<OrganizationRole>,
  ) {}

  //#region getAllPermission
  async getAllPermission(id: string): Promise<any> {
    let permissions = await this.permissionlModel
      .find({ user: id })
      .select('organization role actions')
      .populate([
        {
          path: 'organization',
          select: 'name',
        },
        {
          path: 'role',
          select: 'name',
        },
      ]);
    return permissions;
  }
  //#endregion

  //#region udpateOrCreate
  async updateOrCreate(body: OrgPermissionDto): Promise<any> {
    // Get actions
    let role = await this.roleModel
      .findById(body.role)
      .populate({ path: 'actions', select: 'name short_code' });
    if (!role) {
      throw new BadRequestException(
        'Cannot find organization role with _id ' + body.role + '.',
      );
    }
    let actions: string[] = [];
    for (let i = 0; i < role.actions.length; i++) {
      let item = role.actions[i];
      actions.push(item.short_code);
    }
    const permission = await this.permissionlModel.findOneAndUpdate(
      { user: body.user, organization: body.organization },
      { role: role._id, actions: actions },
      { new: true, upsert: true },
    );
    return permission;
  }
  //#endregion

  //#region delete
  async remove(body: { user: string; organization: string }): Promise<any> {
    let updated = await this.permissionlModel.findOneAndUpdate(
      {
        user: body.user,
        organization: body.organization,
      },
      {
        role: null,
        actions: null,
      },
      { new: true },
    );
    return updated;
  }
  //#endregion
}
