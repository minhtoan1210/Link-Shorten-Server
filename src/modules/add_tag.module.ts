import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
//
import { AuthModule } from 'src/modules/auth.module';
import { UserModule } from 'src/modules/user.module';
import { GuardModule } from 'src/modules/guard.module';
import { Link, LinkSchema } from 'src/schemas/link.schema';
import { TagController } from 'src/controllers/tag.controller';
import { TagService } from 'src/services/tag.service';
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
  controllers: [TagController],
  providers: [TagService],
})
export class TagModule {}
