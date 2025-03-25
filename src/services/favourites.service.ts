import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Link } from 'src/schemas/link.schema';

export class FavouritesService {
  constructor(@InjectModel('Link') private linkModel: mongoose.Model<Link>) {}
  async addListFavourites(user, body) {
    let result = await this.linkModel.updateMany(
      { _id: { $in: body.favourites }, user: user._id },
      { $set: { active: true } },
    );

    return result.matchedCount;
  }

  async removeListFavourites(user,body) {
    const result = await this.linkModel.updateMany(
      {_id: {$in: body.favourites}, user: user._id},
      {$set: { active: false }}
    )
    return result.matchedCount;
  }

  async getListFavourites(user) {
    let result = await this.linkModel.find({
      user: user._id,
      active: true,
    });
   
    return result
  }
}
