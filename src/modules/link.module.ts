import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
//
import { AuthModule } from 'src/modules/auth.module';
import { UserModule } from 'src/modules/user.module';
import { GuardModule } from 'src/modules/guard.module';
import { LinkController } from 'src/controllers/link.controller';
import { Link, LinkSchema } from 'src/schemas/link.schema';
import { LinkService } from 'src/services/link.service';
@Module({
  imports: [
    UserModule,
    AuthModule,
    GuardModule,
    MongooseModule.forFeature([
      {
        name: Link.name,
        schema: LinkSchema,
        collection: 'links',
      },
    ]),
  ],
  controllers: [LinkController],
  providers: [LinkService],
  exports: [MongooseModule, LinkService],
})
export class LinkModule {}
