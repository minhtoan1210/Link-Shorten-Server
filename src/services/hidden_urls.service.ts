import { Injectable } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Link } from 'src/schemas/link.schema';
import { UserRequestDto } from 'src/dtos/auth.dto';

@Injectable()
export class HiddenUrlsService {
  constructor(@InjectModel('Link') private linkModel: mongoose.Model<Link>) {}
    async getListHidden(user: UserRequestDto) {
      let result = await this.linkModel.find({
        user: user._id,
        hidden_urls: true,
      }).lean();
      return result;
    }

    async addHiddenLink(user, body) {
        let result = await this.linkModel.updateMany(
          { _id: { $in: body.favourites }, user: user._id },
          { $set: { active: true } },
        );
    
        return result.matchedCount;
      }
}
