import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Organization } from 'src/schemas/organization.schema';
import { OrganizationAction } from 'src/schemas/organization_action.schema';
export type OrganizationRoleDocument =
  mongoose.HydratedDocument<OrganizationRole>;
@Schema({ timestamps: true, collection: 'org_roles' })
export class OrganizationRole {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
  })
  organization: Organization;
  //
  @Prop({ required: true })
  name: string;
  //
  @Prop({
    required: true,
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'OrganizationAction',
  })
  actions: [OrganizationAction];
}
export const OrganizationRoleSchema =
  SchemaFactory.createForClass(OrganizationRole);
