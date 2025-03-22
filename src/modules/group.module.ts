import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
//
import { GuardModule } from 'src/modules/guard.module';
import { UserModule } from 'src/modules/user.module';
import { OrganizationModule } from 'src/modules/organization.module';
import { Group, GroupSchema } from 'src/schemas/group.schema';
import { GroupController } from 'src/controllers/group.controller';
import { GroupService } from 'src/services/group.service';
@Module({
  imports: [
    GuardModule,
    forwardRef(() => UserModule),
    forwardRef(() => OrganizationModule),
    MongooseModule.forFeature([
      {
        name: Group.name,
        schema: GroupSchema,
        collection: 'groups',
      },
    ]),
  ],
  controllers: [GroupController],
  providers: [GroupService],
  exports: [MongooseModule, GroupService],
})
export class GroupModule {}
