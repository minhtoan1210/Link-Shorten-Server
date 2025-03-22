import * as mongoose from 'mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { OrganizationAction } from 'src/schemas/organization_action.schema';
import {
  OrgActionCreateDto,
  OrgActionUpdateDto,
} from 'src/dtos/organization.dto';
import { organization_action_seeds } from 'src/seeds/organization_action.seed';
@Injectable()
export class OrganizationActionService {
  constructor(
    @InjectModel('OrganizationAction')
    private actionModel: mongoose.Model<OrganizationAction>,
  ) {}

  //#region getById
  async getById(id: string): Promise<OrganizationAction> {
    let action = await this.actionModel.findById(id);
    if (!action) {
      throw new BadRequestException(
        'Cannot find Organization Action with _id ' + id,
      );
    }
    return action;
  }
  //#endregion

  //#region list
  async list(): Promise<OrganizationAction[]> {
    let actions = await this.actionModel.find().sort({ createdAt: 'asc' });
    return actions;
  }
  //#endregion

  //#region create
  async create(body: OrgActionCreateDto): Promise<any> {
    let action = await this.actionModel.findOne({
      short_code: body.short_code,
    });
    if (action) {
      throw new BadRequestException(
        'The action with short code ' +
          body.short_code +
          ' is already existed. Please choose another short code.',
      );
    } else {
      let created = new this.actionModel(body);
      await created.save();
      return created;
    }
  }
  //#endregion

  //#region update
  async update(id: string, body: OrgActionUpdateDto): Promise<any> {
    let action = await this.actionModel.findOne({
      short_code: body.short_code,
    });

    if (action && action._id.toString() != id) {
      throw new BadRequestException(
        'The short code ' +
          body.short_code +
          ' is already used by another action. Please choose another short code.',
      );
    } else {
      let updated = await this.actionModel.findByIdAndUpdate(id, body, {
        new: true,
      });
      return updated;
    }
  }
  //#endregion

  //#region delete
  async delete(id: string): Promise<any> {
    let deleted = await this.actionModel.findByIdAndDelete(id);
    return deleted !== null;
  }
  //#endregion

  //#region seed
  /**
   * Insert organization actions into database.
   * @returns {Number} Number of action inserted.
   */
  async seed(): Promise<Number> {
    let result = 0;
    for (let i = 0; i < organization_action_seeds.length; i++) {
      let body = organization_action_seeds[i];
      let action = await this.actionModel.findOne({
        short_code: body.short_code,
      });
      if (!action) {
        action = new this.actionModel(body);
        await action.save();
        result += 1;
      }
    }
    return result;
  }
  //#endregion
}
