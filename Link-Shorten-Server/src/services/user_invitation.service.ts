import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
//
import { UserInvitationCreateDto } from 'src/dtos/user_invitation.dto';
import { UserInvitation } from 'src/schemas/user_invitation.schema';
@Injectable()
export class UserInvitationService {
  constructor(
    @InjectModel('UserInvitation')
    private invitationModel: mongoose.Model<UserInvitation>,
  ) {}

  //#region create
  async create(body: UserInvitationCreateDto): Promise<any> {
    let expires_time = 1000 * 60 * 60 * 24; // 1 day
    let expiresAt = new Date(Date.now() + expires_time);
    let invitation = new this.invitationModel({
      ...body,
      expiresAt,
    });
    await invitation.save();
    return invitation;
  }
  //#endregion

  //#region getById
  async getById(id: string): Promise<any> {
    let invitation = await this.invitationModel.findById(id);
    if (!invitation) {
      throw new BadRequestException('Cannot find invitation with _id ' + id);
    }
    let now = new Date(Date.now());
    let expiresAt = new Date(invitation.expiresAt);
    if (now > expiresAt) {
      throw new BadRequestException(
        'The invitation has expired and is no longer availabe.',
      );
    }
    return invitation;
  }
  //#endregion

  //#region delete
  async delete(id: string): Promise<any> {
    let deleted = await this.invitationModel.findByIdAndDelete(id);
    return deleted !== null;
  }
  //#endregion
}
