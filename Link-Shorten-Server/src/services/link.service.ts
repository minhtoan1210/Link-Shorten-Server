import * as mongoose from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Link } from 'src/schemas/link.schema';
import { LinkUpdateDto } from 'src/dtos/link.dto';
import { User } from 'src/schemas/user.schema';
import { UserRequestDto } from 'src/dtos/auth.dto';
require('dotenv').config();
@Injectable()
export class LinkService {
  private shorten_length = process.env.SHORTEN_LENGTH
    ? process.env.SHORTEN_LENGTH
    : 6;
  private client_domain = process.env.CLIENT_DOMAIN;
  constructor(
    @InjectModel('Link') private linkModel: mongoose.Model<Link>,
    @InjectModel('User') private userModel: mongoose.Model<User>,
  ) {}

  //#region isShortenUsed
  async isShortenUsed(shorten: string, id?: string): Promise<boolean> {
    let document = await this.linkModel.exists({ shorten: shorten });
    if (document != null) {
      if (id) {
        return document._id.toString() == id ? false : true;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }
  //#endregion

  //#region create
  async create(body: any, user: UserRequestDto): Promise<Link> {
    // Create new document and save
    let document = new this.linkModel({
      ...body,
      user: user._id,
    });
    await document.save();
    // Update links of user
    let documents = await this.linkModel.countDocuments({
      user: new mongoose.Types.ObjectId(user._id),
    });
    await this.userModel.findByIdAndUpdate(
      new mongoose.Types.ObjectId(user._id),
      { links: documents },
    );
    return this.attach_virtuals(document);
  }
  //#endregion

  //#region generateShortenLink
  async generateShortenLink(): Promise<string> {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    function generateString(length) {
      let result = '';
      const charactersLength = characters.length;
      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength),
        );
      }
      return result;
    }
    let shorten = generateString(this.shorten_length);
    let document = await this.linkModel.exists({ shorten: shorten });
    while (document != null) {
      shorten = generateString(this.shorten_length);
    }
    return shorten;
  }
  //#endregion

  //#region getById
  async getById(id: string): Promise<Link | null> {
    let document = await this.linkModel
      .findById(new mongoose.Types.ObjectId(id))
      .lean({ viturals: true });
    return document ? this.attach_virtuals(document) : null;
  }
  //#endregion

  //#region getByShorten
  async getByShorten(shortenLink: string): Promise<Link | null> {
    let document = await this.linkModel
      .findOne({ shorten: shortenLink })
      .lean({ viturals: true });
    return document ? this.attach_virtuals(document) : null;
  }
  //#endregion

  //#region getByOriginal
  async getByOriginal(original: string): Promise<Link | null> {
    let document = await this.linkModel
      .findOne({ original: original })
      .lean({ viturals: true });
    return document ? this.attach_virtuals(document) : null;
  }
  //#endregion

  //#region count
  async count(id?: string): Promise<number> {
    return id
      ? await this.linkModel.countDocuments({
          user: new mongoose.Types.ObjectId(id),
        })
      : await this.linkModel.countDocuments();
  }
  //#endregion

  //#region listWithPagination
  async list(page = 1, limit = 10, date_order = 'desc'): Promise<Link[] | []> {
    let documents = await this.linkModel
      .find()
      .sort({ createdAt: date_order == 'desc' ? 'desc' : 'asc' })
      .skip(page == 1 ? 0 : (page - 1) * limit)
      .limit(limit)
      .lean({ virtuals: true });
    if (documents) {
      return this.attach_virtuals_for_array(documents);
    } else {
      return [];
    }
  }
  //#endregion

  //#region listByUser
  async listByUser(
    id: string,
    page = 1,
    limit = 10,
    date_order = 'desc',
  ): Promise<any[] | []> {
    let documents: any = await this.linkModel
      .find({ user: new mongoose.Types.ObjectId(id) })
      .sort({ createdAt: date_order == 'desc' ? 'desc' : 'asc' })
      .skip(page == 1 ? 0 : (page - 1) * limit)
      .limit(limit)
      .lean({ virtuals: true });
    if (documents) {
      return this.attach_virtuals_for_array(documents);
    } else {
      return [];
    }
  }
  //#endregion

  //#region update
  async update(id: string, body: LinkUpdateDto): Promise<Link | any> {
    let document = await this.linkModel.findByIdAndUpdate(
      new mongoose.Types.ObjectId(id),
      body,
      { new: true },
    );
    return this.attach_virtuals(document);
  }
  //#endregion

  //#region delete
  async delete(id: string) {
    await this.linkModel.findByIdAndDelete(new mongoose.Types.ObjectId(id));
  }
  //#endregion

  //#region attach virtuals for single
  attach_virtuals(document: any) {
    let clean_document = document.toObject ? document.toObject() : document;
    let short_link = this.client_domain + document.shorten;
    return {
      ...clean_document,
      short_link,
    };
  }
  //#endregion

  //#region attach virtuals for array
  attach_virtuals_for_array(documents: any[]) {
    let result: any[] = [];
    documents.map((doc: any) => {
      result.push(this.attach_virtuals(doc));
    });
    return result;
  }
  //#endregion
}
