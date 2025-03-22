import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
//
import { GuardModule } from 'src/modules/guard.module';
import { Currency, CurrencySchema } from 'src/schemas/currency.schema';
import { CurrencyController } from 'src/controllers/currency.controller';
import { CurrencyService } from 'src/services/currency.service';
@Module({
  imports: [
    GuardModule,
    MongooseModule.forFeature([
      {
        name: Currency.name,
        schema: CurrencySchema,
        collection: 'currencies',
      },
    ]),
  ],
  controllers: [CurrencyController],
  providers: [CurrencyService],
  exports: [MongooseModule, CurrencyService],
})
export class CurrencyModule {}
