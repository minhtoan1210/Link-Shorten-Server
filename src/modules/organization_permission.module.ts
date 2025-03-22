import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
//
import { GuardModule } from 'src/modules/guard.module';
import { OrganizationRoleModule } from 'src/modules/organization_role.module';
import {
  OrganizationPermission,
  OrganizationPermissionSchema,
} from 'src/schemas/organization_permission.schema';
import { OrganizationPermissionController } from 'src/controllers/organization_permission.controller';
import { OrganizationPermissionService } from 'src/services/organization_permission.service';
@Module({
  imports: [
    GuardModule,
    forwardRef(() => OrganizationRoleModule),
    MongooseModule.forFeature([
      {
        name: OrganizationPermission.name,
        schema: OrganizationPermissionSchema,
        collection: 'org_permission',
      },
    ]),
  ],
  controllers: [OrganizationPermissionController],
  providers: [OrganizationPermissionService],
  exports: [MongooseModule, OrganizationPermissionService],
})
export class OrganizationPermissionModule {}
