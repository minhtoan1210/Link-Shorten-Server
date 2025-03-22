import * as mongoose from 'mongoose';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Organization } from 'src/schemas/organization.schema';
import {
  OrgUpdateUsersDto,
  OrgCreateDto,
  OrgUpdateDto,
} from 'src/dtos/organization.dto';
import { User } from 'src/schemas/user.schema';
import { Group } from 'src/schemas/group.schema';
require('dotenv').config();
@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel('Organization') private orgModel: mongoose.Model<Organization>,
    @InjectModel('User') private userModel: mongoose.Model<User>,
    @InjectModel('Group') private groupModel: mongoose.Model<Group>,
  ) {}

  //#region count
  async count() {
    return await this.orgModel.countDocuments();
  }
  //#endregion

  //#region countMine
  async countMine(user: string) {
    return await this.orgModel.countDocuments({
      owner: user,
    });
  }
  //#endregion

  //#region isOwner
  async isOwner(id: string, user: string): Promise<boolean> {
    let organization = await this.orgModel.countDocuments({
      _id: id,
      owner: user,
    });
    return organization > 0;
  }
  //#endregion

  //#region isExisted
  async getByEmail(email: string): Promise<any> {
    let org = await this.orgModel.findOne({ email: email });
    return org;
  }
  //#endregion

  //#region getById
  async getById(id: string): Promise<any> {
    let org = await this.orgModel.findById(id).lean();
    if (org) {
      delete org.users;
      let groups = await this.groupModel
        .find({ organization: id })
        .select('owner users users_detail name createdAt')
        .populate([
          {
            path: 'owner',
            select: 'email fullname',
          },
          {
            path: 'users',
            select: 'email fullname',
          },
        ])
        .sort({ createdAt: 'desc' });
      let org_with_groups = {
        ...org,
        groups,
      };
      return org_with_groups;
    } else {
      throw new BadRequestException('Cannot find ogranization with _id ' + id);
    }
  }
  //#endregion

  //#region list
  async list(page = 1, limit = 10, date_order = 'desc'): Promise<any> {
    let orgs = await this.orgModel
      .find()
      .sort({ createdAt: date_order == 'desc' ? 'desc' : 'asc' })
      .skip(page == 1 ? 0 : (page - 1) * limit)
      .limit(limit)
      .populate({
        path: 'owner',
        select: 'email fullname',
      })
      .select('-users');
    return orgs;
  }
  //#endregion

  //#region listByOwner
  async listByOwner(
    id: string,
    page = 1,
    limit = 10,
    date_order = 'desc',
  ): Promise<any> {
    let orgs = await this.orgModel
      .find({ owner: id })
      .select('-users')
      .sort({ createdAt: date_order == 'desc' ? 'desc' : 'asc' })
      .skip(page == 1 ? 0 : (page - 1) * limit)
      .limit(limit);
    return orgs ? orgs : [];
  }
  //#endregion

  //#region create
  async create(body: OrgCreateDto, user: string): Promise<Organization> {
    let owner = user;
    let org = new this.orgModel({ ...body, owner });
    await org.save();
    await this.userModel.findByIdAndUpdate(owner, {
      $addToSet: { organizations: org._id },
    });
    return org;
  }
  //#endregion

  //#region update
  async update(id: string, body: OrgUpdateDto): Promise<any> {
    return await this.orgModel.findByIdAndUpdate(
      new mongoose.Types.ObjectId(id),
      body,
      { new: true },
    );
  }
  //#endregion

  //#region delete
  async delete(id: string): Promise<any> {
    let org = await this.orgModel.findById(id);
    if (!org) {
      throw new NotFoundException('Cannot find organization with _id ' + id);
    }
    await this.userModel.findByIdAndUpdate(org.owner, {
      $pull: { organizations: id },
    });
    let result = await org.deleteOne();
    return result.deletedCount > 0;
  }
  //#endregion

  //#region addUser
  async addUser(id: string, body: OrgUpdateUsersDto): Promise<any> {
    let existed = await this.orgModel.findById(id);
    if (!existed) {
      throw new BadRequestException('Cannot find organization with _id ' + id);
    }

    let emails = body.users;
    let users = await Promise.all(
      emails.map((email: string) => this.userModel.findOne({ email: email })),
    );
    let users_existed: string[] = [];
    let users_waiting: string[] = [];
    users.forEach((user: any, i: number) => {
      if (user) {
        users_existed.push(user._id);
      } else {
        users_waiting.push(emails[i]);
      }
    });

    let org = await this.orgModel.updateOne(
      { _id: id },
      {
        $addToSet: {
          users: { $each: users_existed },
          users_waiting: { $each: users_waiting },
        },
      },
    );
    let userUpdate = await this.userModel.updateMany(
      { _id: { $in: users_existed } },
      { $addToSet: { organizations_joined: id } },
    );
    return org.modifiedCount > 0 || userUpdate.modifiedCount > 0;
  }
  //#endregion

  //#region removeUser
  async removeUser(organization: string, user: string): Promise<any> {
    let org = await this.orgModel.findById(organization);
    if (!org) {
      throw new BadRequestException(
        'Cannot find organization with _id ' + organization,
      );
    }
    let user_remove = await this.userModel.findById(user);
    if (!user_remove) {
      throw new BadRequestException('Cannot find user with _id ' + user);
    }

    if (user_remove.groups_joined && user_remove.groups_joined.length > 0) {
      // Get groups user joined in organization
      let groups = await this.groupModel.find({
        organization: organization,
        users: {
          $in: [user],
        },
      });
      for (let i = 0; i < groups.length; i++) {
        let group = groups[i];
        if (group.users.length > 1) {
          let new_users = group.users.filter(
            (item: any) => item.toString() !== user,
          );

          if (group.owner == user) group.owner = new_users[0];
          group.users = new_users;

          await group.save();
        } else {
          await group.deleteOne();
        }
      }

      let remove_groups = groups.map((group: any) => group._id.toString());

      let groups_joined = user_remove.groups_joined.map((id) => id.toString());

      let new_groups_joined = groups_joined.filter(
        (id) => !remove_groups.includes(id),
      );

      user_remove.groups_joined = new_groups_joined;
      await user_remove.save();
    }

    // // Remove users from organization

    let new_users = org.users?.filter((id) => id.toString() !== user);
    org.users = new_users;
    await org.save();

    let new_organizations_joined = user_remove.organizations_joined?.filter(
      (id) => id.toString() !== organization,
    );
    user_remove.organizations_joined = new_organizations_joined;
    await user_remove.save();

    return true;
  }
  //#endregion

  //#region getUsers
  async getUsers(
    organization: string,
    page = 1,
    limit = 10,
    date_order = 'desc',
  ): Promise<any> {
    let users = await this.userModel
      .find({
        organizations_joined: { $in: organization },
      })
      .sort({ createdAt: date_order == 'desc' ? 'desc' : 'asc' })
      .skip(page == 1 ? 0 : (page - 1) * limit)
      .limit(limit);

    return users;
  }
  //#endregion

  //#region countUsers
  async countUsers(organization: string) {
    let count = await this.userModel.countDocuments({
      organizations_joined: organization,
    });
    return count;
  }
  //#endregion
}
