import * as mongoose from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Currency } from 'src/schemas/currency.schema';
import { CurrencyDto, CurrencyUpdateDto } from 'src/dtos/currency.dto';
import { currency_seeds } from 'src/seeds/currency.seed';
@Injectable()
export class CurrencyService {
  constructor(
    @InjectModel('Currency') private currencyModel: mongoose.Model<Currency>,
  ) {}

  //#region seed
  /**
   * Insert currencies into database.
   * @returns {Number} Number of currency inserted.
   */
  async seed(): Promise<Number> {
    let result = 0;
    for (let i = 0; i < currency_seeds.length; i++) {
      let body = currency_seeds[i];
      let currency = await this.currencyModel.findOne({ value: body.value });
      if (!currency) {
        currency = new this.currencyModel(body);
        await currency.save();
        result += 1;
      }
    }
    return result;
  }
  //#endregion

  //#region isExisted
  async isExisted(value: string): Promise<boolean> {
    let count = await this.currencyModel.countDocuments({ value: value });
    return count > 0;
  }
  //#endregion

  //#region list
  async list(): Promise<Currency[]> {
    let currencies = await this.currencyModel.find().sort({ name: 'asc' });
    return currencies;
  }
  //#endregion

  //#region getById
  async getById(id: string): Promise<Currency | null> {
    let currency = await this.currencyModel.findById(
      new mongoose.Types.ObjectId(id),
    );
    return currency;
  }
  //#endregion

  //#region create
  async create(body: CurrencyDto): Promise<Currency> {
    let document = new this.currencyModel(body);
    return await document.save();
  }
  //#endregion

  //#region update
  async update(id: string, body: CurrencyUpdateDto): Promise<any> {
    return await this.currencyModel.findByIdAndUpdate(
      new mongoose.Types.ObjectId(id),
      body,
      { new: true },
    );
  }
  //#endregion

  //#region delete
  async delete(id: string): Promise<any> {
    let deleted = await this.currencyModel.findByIdAndDelete(id);
    return deleted !== null;
  }
  //#endregion
}
