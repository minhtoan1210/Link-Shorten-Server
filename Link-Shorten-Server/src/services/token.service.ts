import { Injectable } from '@nestjs/common';
import { Token } from 'src/schemas/token.schema';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { TokenCreateDto } from 'src/dtos/token.dto';
import { TokenPayloadDto } from 'src/dtos/auth.dto';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel('Token') private tokenModel: mongoose.Model<Token>,
  ) {}
  //#region create
  async create(body: TokenCreateDto): Promise<Token> {
    let token = new this.tokenModel(body);
    await token.save();
    return token;
  }
  //#endregion

  //#region delete
  async delete(token: string, type: string): Promise<any> {
    return await this.tokenModel.findOneAndDelete({ value: token, type: type });
  }
  //#endregion

  //#region isIpMatched
  async isIpMatched(token: string, type: string, ip: string): Promise<boolean> {
    let document = await this.tokenModel.findOne({ value: token });
    if (!document || document == null) {
      return false;
    }
    return document.ip == ip;
  }
  //#endregion

  //#region generateTokenPayload
  async generateTokenPayload(user: any): Promise<TokenPayloadDto> {
    let user_info = user.toObject ? user.toObject() : user;
    let payload = {
      user: {
        _id: user_info._id,
        email: user_info.email,
        fullname: user_info.fullname,
        type: user_info.type,
      },
    };
    return payload;
  }
  //#endregion
}
