import * as mongoose from 'mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Plan } from 'src/schemas/plan.schema';
import { PlanCreateDto, PlanUpdateDto } from 'src/dtos/plan.dto';
import { plan_seeds } from 'src/seeds/plan.seed';
@Injectable()
export class PlanService {
  constructor(@InjectModel('Plan') private planModel: mongoose.Model<Plan>) {}

  //#region create
  async create(body: PlanCreateDto): Promise<Plan> {
    let plan = new this.planModel(body);
    await plan.save();
    return plan;
  }
  //#endregion

  //#region update
  async update(id: string, body: PlanUpdateDto): Promise<Plan | null> {
    let plan = await this.planModel.findByIdAndUpdate(
      new mongoose.Types.ObjectId(id),
      body,
      { new: true },
    );
    return plan;
  }
  //#endregion

  //#region delete
  async delete(id: string): Promise<boolean> {
    let result = await this.planModel.findByIdAndDelete(
      new mongoose.Types.ObjectId(id),
    );
    return result !== null;
  }
  //#endregion

  //#region getById
  async getById(id: string): Promise<Plan | null> {
    let plan = await this.planModel.findById(new mongoose.Types.ObjectId(id));
    return plan;
  }
  //#endregion

  //#region list
  async list(): Promise<Plan[] | []> {
    let plans = await this.planModel.find().sort({ name: 'asc' });
    return plans;
  }
  //#endregion

  //#region seeding
  /**
   * Insert data of plans into database.
   * @returns {Number} Number of plan created.
   */
  async seed(): Promise<Number> {
    let result = 0;
    for (let i = 0; i < plan_seeds.length; i++) {
      let body = plan_seeds[i];
      let plan = await this.planModel.findOne({ name: body.name });
      if (!plan) {
        plan = new this.planModel(body);
        await plan.save();
        result += 1;
      }
    }
    return result;
  }
  //#endregion
}
