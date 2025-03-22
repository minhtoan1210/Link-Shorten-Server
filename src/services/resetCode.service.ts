import { BadRequestException, Injectable } from '@nestjs/common';
import { ResetCode } from 'src/schemas/resetCode.schema';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import * as crypto from 'crypto';
@Injectable()
export class ResetCodeService {
  reset_code = Number(process.env.RESET_CODE_LENGTH);
  constructor(
    @InjectModel('ResetCode') private codeModel: mongoose.Model<ResetCode>,
  ) {}

  //#region generate
  async create(email: string) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let random_code = Array.from(crypto.randomBytes(this.reset_code))
      .map((x) => chars[x % chars.length])
      .join('');
    let expires_time = 1000 * 60 * 10; // 10 minutes
    let code = new this.codeModel({
      email: email,
      value: random_code,
      expiresAt: new Date(Date.now() + expires_time),
    });
    await code.save();
    return code;
  }
  //#endregion

  //#region sendCodeToEmail
  async sendCodeToEmail(code: string, email: string) {
    return true;
  }
  //#endregion

  //#region isValid
  async isValid(body: { email: string; value: string }): Promise<any> {
    let code = await this.codeModel.findOne({
      email: body.email,
      value: body.value,
    });
    if (!code) {
      throw new BadRequestException('Invalid reset code.');
    } else {
      let now = new Date();
      if (now > code.expiresAt) {
        throw new BadRequestException('Reset code expired.');
      }
      return true;
    }
  }
  //#endregion

  //#region delete
  async delete(email: string, value: string): Promise<boolean> {
    let result = await this.codeModel.findOneAndDelete({
      email: email,
      value: value,
    });
    return result !== null;
  }
  //#endregion
}
