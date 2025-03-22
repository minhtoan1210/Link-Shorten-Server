import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { OrganizationRole } from 'src/schemas/organization_role.schema';
import { User } from 'src/schemas/user.schema';
import { Organization } from 'src/schemas/organization.schema';
export type OrganizationPermissionDocument =
  mongoose.HydratedDocument<OrganizationPermission>;
@Schema({ timestamps: true, collection: 'org_permissions' })
export class OrganizationPermission {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OrganizationRole',
  })
  role: OrganizationRole;
  //
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
  //
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
  })
  organization: Organization;
  //
  @Prop({ type: [String] })
  actions: string[];
}
export const OrganizationPermissionSchema = SchemaFactory.createForClass(
  OrganizationPermission,
);
