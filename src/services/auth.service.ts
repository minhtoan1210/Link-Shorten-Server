import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';
import { AuthTokenDto, TokenPayloadDto } from 'src/dtos/auth.dto';
import { User } from 'src/schemas/user.schema';
import { Token } from 'src/schemas/token.schema';
import { ResetCode } from 'src/schemas/resetCode.schema';
import { TokenService } from 'src/services/token.service';
import { ResetPasswordDto } from 'src/dtos/auth.dto';
require('dotenv').config();

const access_token_secret = process.env.ACCESS_TOKEN_SECRET;
const access_token_expire = Number(process.env.ACCESS_TOKEN_EXPIRE);
const refresh_token_secret = process.env.REFRESH_TOKEN_SECRET;
const refresh_token_expire = Number(process.env.REFRESH_TOKEN_EXPIRE);

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private tokenService: TokenService,
    @InjectModel('User') private userModel: mongoose.Model<User>,
    @InjectModel('Token') private tokenModel: mongoose.Model<Token>,
    @InjectModel('ResetCode') private resetCodeModel: mongoose.Model<ResetCode>,
  ) {}

  // #region generate tokens
  async generate(
    payload: TokenPayloadDto,
    ip: string,
    location?: any,
  ): Promise<AuthTokenDto> {
    let access_token = await this.jwtService.signAsync(payload, {
      secret: access_token_secret,
      expiresIn: '4h',
    });

    let refresh_token = await this.jwtService.signAsync(payload, {
      secret: refresh_token_secret,
      expiresIn: '7d',
    });

    let store_access_token = new this.tokenModel({
      value: access_token,
      ip: ip,
      type: 'access',
      location: {},
    });

    let store_refresh_token = new this.tokenModel({
      value: refresh_token,
      ip: ip,
      type: 'refresh',
      location: {},
    });

    if (location) {
      store_access_token.location = location;
      store_refresh_token.location = location;
    }
    await store_access_token.save();
    await store_refresh_token.save();

    return {
      access_token: access_token,
      access_expires_in: access_token_expire,
      access_expires_at: new Date(Date.now() + access_token_expire),
      refresh_token: refresh_token,
      refresh_expires_in: refresh_token_expire,
      refresh_expires_at: new Date(Date.now() + refresh_token_expire),
    };
  }
  // #endregion

  //#region login
  async login(
    email: string,
    password: string,
    ip: string,
    location?: any,
  ): Promise<AuthTokenDto> {
    let document = await this.userModel
      .findOne({ email: email })
      .select('+hashed_password');
    if (document == null) {
      throw new UnauthorizedException(
        'Wrong email or password. Please try again.',
      );
    } else {
      let isMatched = await bcrypt.compare(password, document.hashed_password);
      if (isMatched == false) {
        throw new UnauthorizedException(
          'Wrong email or password. Please try again.',
        );
      }
      
      console.log("document", document)

      let payload = await this.tokenService.generateTokenPayload(document);
      return await this.generate(payload, ip, location);
    }
  }
  //#endregion

  //#region refresh
  async refresh(
    refresh_token: string,
    ip: string,
    location?: any,
  ): Promise<AuthTokenDto> {
    let verified = await this.jwtService.verify(refresh_token, {
      secret: refresh_token_secret,
    });
    if (!verified) {
      throw new BadRequestException('Refresh token invalid or expired.');
    }
    const { iat, exp, ...payload } = verified;
    return await this.generate(payload, ip, location);
  }
  // #endregion

  //#region getPayloadFromRequest
  async getUserFromRequest(request: any): Promise<any> {
    let result: any = undefined;
    let access_token = request.headers['authorization'];
    if (access_token) {
      access_token = access_token.replace('Bearer ', '');
      let verified = await this.jwtService.verify(access_token, {
        secret: access_token_secret,
      });
      if (!verified) {
        throw new BadRequestException('Refresh token invalid or expired.');
      }
      const { iat, exp, ...payload } = verified;
      result = payload.user;
    }
    return result;
  }
  //#endregion

  //#region isAdmin
  isAdmin(user: any): boolean {
    return user.type == 'admin';
  }
  //#endregion

  //#region isOwner
  isOwner(id: string, document: any): boolean {
    if (!document.user || document.user != id) {
      return false;
    }
    return true;
  }
  //#endregion

  //#region resetPassword
  async resetPassword(body: ResetPasswordDto): Promise<any> {
    let user = await this.userModel.findOne({ email: body.email });
    if (user) {
      // Update user
      let salt = await bcrypt.genSalt();
      let hashed_password = await bcrypt.hash(body.new_password, salt);
      user.hashed_password = hashed_password;
      await user.save();
      // Delete reset codes
      await this.resetCodeModel.deleteMany({ email: body.email });
      return true;
    } else {
      throw new BadRequestException(
        'Cannot find user with email ' + body.email,
      );
    }
  }
  //#endregion

  //#region isExisted
  async isExisted(email: string): Promise<any> {
    let count = await this.userModel.findOne({ email: email });
    return count;
  }
  //#endregion
}
