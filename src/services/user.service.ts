import * as mongoose from 'mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
//
import { UserInvitationService } from 'src/services/user_invitation.service';
import { User } from 'src/schemas/user.schema';
import {
  UserCreateDto,
  UserCreateWithInvitationDto,
  UserUpdateDto,
} from 'src/dtos/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: mongoose.Model<User>,
    private inviteService: UserInvitationService,
  ) {}

  //#region isEmailRegistered
  async isEmailRegistered(email: string): Promise<boolean> {
    let user = await this.userModel.findOne({ email: email });
    return user ? true : false;
  }
  //#endregion

  //#region generateRandomPassword
  generateRandomPassword(length = 8): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from(crypto.randomBytes(length))
      .map((x) => chars[x % chars.length])
      .join('');
  }

  //#endregion

  //#region create
  async create(body: UserCreateDto): Promise<User> {
    let salt = await bcrypt.genSalt();
    let hashed_password = await bcrypt.hash(body.password, salt);
    let create = {
      hashed_password: hashed_password,
      ...body,
    };
    let document = new this.userModel(create);
    return await document.save();
  }
  //#endregion

  //#region createWithInvitation
  async createWithInvitation(body: UserCreateWithInvitationDto): Promise<any> {
    let invitation = await this.inviteService.getById(body.invitation);
    // Create user
    let isEmailRegistered = await this.isEmailRegistered(body.email);
    if (isEmailRegistered == true) {
      throw new BadRequestException(
        'Email ' + body.email + ' is already registered.',
      );
    }
    let salt = await bcrypt.genSalt();
    let hashed_password = await bcrypt.hash(body.password, salt);
    let user = new this.userModel({
      email: body.email,
      fullname: body.fullname,
      hashed_password: hashed_password,
      organizations_joined: [body.organization],
    });
    await user.save();
    // Add user to organization & Remove user from wating list

    // Set permission base on organization's role
  }

  //#endregion

  //#region findById
  async findById(id: string): Promise<User | null> {
    let document = await this.userModel.findById(
      new mongoose.Types.ObjectId(id),
    );

    return document ? document : null;
  }
  //#endregion

  //#region findByEmail
  async findByEmail(email: string): Promise<User | null> {
    let document = await this.userModel.findOne({ email: email });
    return document ? document : null;
  }
  //#endregion

  //#region count
  async count(): Promise<number> {
    return await this.userModel.countDocuments();
  }
  //#endregion

  //#region list
  async list(
    page: number = 1,
    limit: number = 10,
    date_order: string = 'desc',
  ): Promise<User[] | []> {
    let documents = await this.userModel
      .find()
      .sort({ createdAt: date_order == 'desc' ? 'desc' : 'asc' })
      .skip(page == 1 ? 0 : (page - 1) * limit)
      .limit(limit);
    return documents ? documents : [];
  }
  //#endregion

  //#region update
  async update(id: string, body: UserUpdateDto): Promise<User | any> {
    let document = await this.userModel.findById(
      new mongoose.Types.ObjectId(id),
    );
    if (document) {
      // Remove non-update fields
      let remove_keys = ['confirm_new_password'];
      for (let key of remove_keys) {
        delete body[key];
      }
      // Update
      let update_keys = Object.getOwnPropertyNames(body);
      for (let key of update_keys) {
        if (body[key]) {
          switch (key) {
            case 'new_password': {
              let salt = await bcrypt.genSalt();
              document.hashed_password = await bcrypt.hash(body[key], salt);
              break;
            }
            default: {
              document[key] = body[key];
              break;
            }
          }
        }
      }
      return await document.save();
    } else {
      return null;
    }
  }
  //#endregion

  //#region delete
  async delete(id: string) {
    await this.userModel.findByIdAndDelete(new mongoose.Types.ObjectId(id));
  }
  //#endregion
}
