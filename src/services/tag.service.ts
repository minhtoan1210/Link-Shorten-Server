import { Injectable } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Link } from 'src/schemas/link.schema';
import { UserRequestDto } from 'src/dtos/auth.dto';

@Injectable()
export class TagService {
  constructor(
    @InjectModel('Link') private linkModel: mongoose.Model<Link>,
  ) {}

  async getListAddTag(user: UserRequestDto) {
    let result = await this.linkModel.find({
      user: user._id,
      addtag: { $ne: '' },
    }).lean();

    return result;
  }
}
