import * as mongoose from 'mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Group } from 'src/schemas/group.schema';
import {
  GroupCreateDto,
  GroupUpdateDto,
  GroupUpdateUsersDto,
} from 'src/dtos/group.dto';
import { User } from 'src/schemas/user.schema';
@Injectable()
export class GroupService {
  constructor(
    @InjectModel('Group') private groupModel: mongoose.Model<Group>,
    @InjectModel('User') private userModel: mongoose.Model<User>,
  ) {}

  //#region count
  async count() {
    return await this.groupModel.countDocuments();
  }
  //#endregion

  //#region countOfOrganization
  async countOfOrganization(org: string) {
    return await this.groupModel.countDocuments({ organization: org });
  }
  //#endregion

  //#region countOwned
  async countOwned(user: string) {
    return await this.groupModel.countDocuments({ owner: user });
  }
  //#endregion

  //#region countJoined
  async countJoined(user: string) {
    return await this.groupModel.countDocuments({ users: { $in: user } });
  }
  //#endregion

  //#region isOwner
  async isOwner(id: string, user: string) {
    let group = await this.groupModel.countDocuments({
      _id: id,
      owner: user,
    });
    return group > 0 ? true : false;
  }
  //#endregion

  //#region getById
  async getById(id: string): Promise<Group | null> {
    let group = await this.groupModel.findById(id).populate({
      path: 'users',
      select: 'email fullname',
    });
    return group;
  }
  //#endregion

  //#region list
  async list(page = 1, limit = 10, date_order = 'desc'): Promise<Group[] | []> {
    let groups = await this.groupModel
      .find()
      .sort({ createdAt: date_order == 'desc' ? 'desc' : 'asc' })
      .skip(page == 1 ? 0 : (page - 1) * limit)
      .limit(limit)
      .populate({
        path: 'organization',
        select: '-address',
      });
    return groups ? groups : [];
  }
  //#endregion

  //#region listOfOrganization
  async listOfOrganization(
    id: string,
    page = 1,
    limit = 10,
    date_order = 'desc',
  ): Promise<Group[] | []> {
    let groups = await this.groupModel
      .find({ organization: id })
      .sort({ createdAt: date_order == 'desc' ? 'desc' : 'asc' })
      .skip(page == 1 ? 0 : (page - 1) * limit)
      .limit(limit)
      .populate([
        { path: 'owner', select: 'email fullname' },
        { path: 'users', select: 'email fullname' },
      ]);
    return groups;
  }
  //#endregion

  //#region owned
  async owned(
    user: string,
    page = 1,
    limit = 10,
    date_order = 'desc',
  ): Promise<any[] | []> {
    let groups = await this.groupModel
      .find({ owner: user })
      .sort({ createdAt: date_order == 'desc' ? 'desc' : 'asc' })
      .skip(page == 1 ? 0 : (page - 1) * limit)
      .limit(limit)
      .populate({
        path: 'organization',
        select: 'name',
      })
      .select('-owner');
    return groups ? groups : [];
  }
  //#endregion

  //#region joined
  async joined(
    user: string,
    page = 1,
    limit = 10,
    date_order = 'desc',
  ): Promise<any[] | []> {
    let groups = await this.groupModel
      .find({
        users: { $in: user },
      })
      .sort({ createdAt: date_order == 'desc' ? 'desc' : 'asc' })
      .skip(page == 1 ? 0 : (page - 1) * limit)
      .limit(limit)
      .populate([
        { path: 'organization', select: 'name' },
        { path: 'owner', select: 'fullname ' },
      ]);
    return groups;
  }
  //#endregion

  //#region create
  async create(body: GroupCreateDto): Promise<Group> {
    let owner = await this.userModel.findById(body.owner);
    if (!owner) {
      throw new BadRequestException(
        'Cannot find user with _id ' + body.owner + '  to set owner for group.',
      );
    }
    let group = new this.groupModel(body);
    let users: string[] = body.users ? body.users : [];
    if (!users.includes(owner._id.toString())) {
      users.push(owner._id.toString());
    }
    group.users = users;
    await group.save();

    // Update group's members
    await this.userModel.updateMany(
      { _id: { $in: group.users } },
      { $addToSet: { groups_joined: group._id } },
    );
    return group;
  }
  //#endregion

  //#region addUsers
  async addUsers(id: string, body: GroupUpdateUsersDto): Promise<any> {
    let group = await this.groupModel.findById(id);
    if (!group) {
      throw new BadRequestException('Cannot find group with _id ' + id);
    }
    let groupUpdate = await this.groupModel.updateOne(
      { _id: id },
      { $addToSet: { users: { $each: body.users } } },
    );
    let userUpdate = await this.userModel.updateMany(
      { _id: { $in: body.users } },
      { $addToSet: { groups_joined: id } },
    );
    return groupUpdate.modifiedCount > 0 || userUpdate.modifiedCount > 0;
  }
  //#endregion

  //#region removeUsers
  async removeUsers(id: string, body: GroupUpdateUsersDto): Promise<any> {
    let group = await this.groupModel.findById(id);
    if (!group) {
      throw new BadRequestException('Cannot find group with _id ' + id);
    }
    let groupUpdate = await this.groupModel.updateOne(
      { _id: id },
      { $pull: { users: { $in: body.users } } },
    );
    let userUpdate = await this.userModel.updateMany(
      { _id: { $in: body.users } },
      { $pull: { groups_joined: id } },
    );
    return groupUpdate.modifiedCount > 0 || userUpdate.modifiedCount > 0;
  }
  //#endregion

  //#region update
  async update(id: string, body: GroupUpdateDto): Promise<Group | null> {
    let group = await this.groupModel.findById(id);
    if (!group) {
      throw new BadRequestException('Cannot find group with _id ' + id);
    }
    const filteredBody = Object.fromEntries(
      Object.entries(body).filter(([_, value]) => value !== undefined),
    );

    for (let [key, value] of Object.entries(filteredBody)) {
      switch (key) {
        case 'users': {
          let current_users: string[] = group.users;
          let new_users: string[] = body.users!;

          let add_users = new_users.filter(
            (user) => !current_users.includes(user),
          );
          let remove_users = current_users.filter(
            (user) => !new_users.includes(user),
          );

          const promise_add_users = Promise.all(
            add_users.map((user: string) => {
              this.userModel.findByIdAndUpdate(user, {
                $addToSet: { groups_joined: id },
              });
            }),
          );

          const promise_remove_users = Promise.all(
            remove_users.map((user: string) => {
              this.userModel.findByIdAndUpdate(user, {
                $pull: { groups_joined: id },
              });
            }),
          );
          await Promise.all([promise_add_users, promise_remove_users]);
          group.users = body.users!;
          if (!group.users.includes(group.owner)) group.owner = group.users[0];
          break;
        }
        default: {
          group[key] = value;
          break;
        }
      }
    }
    await group.save();
    return group;
  }
  //#endregion

  //#region changeOwner
  async changeOwner(id: string, user: string): Promise<any> {
    await this.groupModel.findByIdAndUpdate(id, { owner: user });
    return true;
  }
  //#endregion

  //#region delete
  async delete(id: string): Promise<any> {
    let group = await this.groupModel.findById(id);
    if (!group) {
      throw new BadRequestException('Cannot find group with _id ' + id);
    }
    let users = group.users;
    await this.userModel.updateMany(
      { _id: { $in: users } },
      { $pull: { groups_joined: id } },
    );
    await group.deleteOne();
    return true;
  }
  //#endregion
}
