import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { OrgRoleCreateDto, OrgRoleUpdateDto } from 'src/dtos/organization.dto';
import { OrganizationRole } from 'src/schemas/organization_role.schema';
import { OrganizationPermission } from 'src/schemas/organization_permission.schema';
@Injectable()
export class OrganizationRoleService {
  constructor(
    @InjectModel('OrganizationRole')
    private roleModel: mongoose.Model<OrganizationRole>,
    @InjectModel('OrganizationPermission')
    private permissionModel: mongoose.Model<OrganizationPermission>,
  ) {}

  //#region list
  async list(id: string): Promise<OrganizationRole[] | []> {
    let roles = await this.roleModel
      .find({ organization: id })
      .select('-actions');
    return roles ? roles : [];
  }
  //#endregion

  //#region getById
  async getById(id: string): Promise<any> {
    let role = await this.roleModel.findById(id).populate({
      path: 'actions',
      select: 'name short_code',
    });
    return role;
  }
  //#endregion

  //#region create
  async create(body: OrgRoleCreateDto): Promise<any> {
    let created = new this.roleModel(body);
    await created.save();
    return created;
  }
  //#endregion

  //#region update
  async update(id: string, body: OrgRoleUpdateDto): Promise<any> {
    let updated = await this.roleModel
      .findByIdAndUpdate(id, body, {
        new: true,
      })
      .populate('actions')
      .select('short_code');

    if (updated && body.actions) {
      let actions: string[] = [];
      for (let i = 0; i < updated.actions.length; i++) {
        let short_code = updated.actions[i].short_code;
        actions.push(short_code);
      }
      await this.permissionModel.updateMany({ role: id }, { actions: actions });
    }
    return updated;
  }
  //#endregion

  //#region delete
  async delete(id: string): Promise<any> {
    let deleted = await this.roleModel.findByIdAndDelete(id);
    if (deleted !== null) {
      await this.permissionModel.updateMany(
        { role: id },
        { role: null, actions: null },
      );
      return true;
    }
    return false;
  }
  //#endregion
}
