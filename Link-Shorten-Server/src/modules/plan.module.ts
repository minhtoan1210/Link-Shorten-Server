import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
//
import { GuardModule } from './guard.module';
import { Plan, PlanSchema } from 'src/schemas/plan.schema';
import { PlanController } from 'src/controllers/plan.controller';
import { PlanService } from 'src/services/plan.service';
@Module({
  imports: [
    GuardModule,
    MongooseModule.forFeature([
      {
        name: Plan.name,
        schema: PlanSchema,
        collection: 'plans',
      },
    ]),
  ],
  controllers: [PlanController],
  providers: [PlanService],
  exports: [MongooseModule, PlanService],
})
export class PlanModule {}
