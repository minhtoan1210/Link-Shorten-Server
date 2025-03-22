import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
//
import { GuardModule } from 'src/modules/guard.module';
import { OrganizationPermissionModule } from 'src/modules/organization_permission.module';
import {
  OrganizationRole,
  OrganizationRoleSchema,
} from 'src/schemas/organization_role.schema';
import { OrganizationRoleController } from 'src/controllers/organization_role.controller';
import { OrganizationRoleService } from 'src/services/organization_role.service';
@Module({
  imports: [
    GuardModule,
    forwardRef(() => OrganizationPermissionModule),
    MongooseModule.forFeature([
      {
        name: OrganizationRole.name,
        schema: OrganizationRoleSchema,
        collection: 'org_roles',
      },
    ]),
  ],
  controllers: [OrganizationRoleController],
  providers: [OrganizationRoleService],
  exports: [MongooseModule, OrganizationRoleService],
})
export class OrganizationRoleModule {}
