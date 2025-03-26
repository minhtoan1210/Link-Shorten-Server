import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
//
import { AuthModule } from 'src/modules/auth.module';
import { UserModule } from 'src/modules/user.module';
import { GuardModule } from 'src/modules/guard.module';
import { Link, LinkSchema } from 'src/schemas/link.schema';
import { HiddenUrlsController } from 'src/controllers/hidden_urls.controller';
import { HiddenUrlsService } from 'src/services/hidden_urls.service';
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
  controllers: [HiddenUrlsController],
  providers: [HiddenUrlsService],
})
export class HiddenUrlsModule {}
