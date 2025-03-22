import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
//
import { GuardModule } from 'src/modules/guard.module';
import {
  OrganizationAction,
  OrganizationActionSchema,
} from 'src/schemas/organization_action.schema';
import { OrganizationActionController } from 'src/controllers/organization_action.controller';
import { OrganizationActionService } from 'src/services/organization_action.service';
@Module({
  imports: [
    GuardModule,
    MongooseModule.forFeature([
      {
        name: OrganizationAction.name,
        schema: OrganizationActionSchema,
        collection: 'org_actions',
      },
    ]),
  ],
  controllers: [OrganizationActionController],
  providers: [OrganizationActionService],
  exports: [MongooseModule, OrganizationActionService],
})
export class OrganizationActionModule {}
