import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
//
import { ResetCode, ResetCodeSchema } from 'src/schemas/resetCode.schema';
import { ResetCodeService } from 'src/services/resetCode.service';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ResetCode.name,
        schema: ResetCodeSchema,
        collection: 'reset_codes',
      },
    ]),
  ],
  controllers: [],
  providers: [ResetCodeService],
  exports: [MongooseModule, ResetCodeService],
})
export class ResetCodeModule {}
