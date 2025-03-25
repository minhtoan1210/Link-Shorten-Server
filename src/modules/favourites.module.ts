import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
//
import { GuardModule } from 'src/modules/guard.module';
import { FavouritesController } from 'src/controllers/favourites.controller';
import { Link, LinkSchema } from 'src/schemas/link.schema';
import { LinkModule } from './link.module';
import { FavouritesService } from 'src/services/favourites.service';
import { UserModule } from './user.module';
@Module({
  imports: [
    GuardModule,
     UserModule,
    forwardRef(() => LinkModule),
    MongooseModule.forFeature([
      {
        name: Link.name,
        schema: LinkSchema,
        collection: 'links',
      },
    ]),
  ],
  controllers: [FavouritesController],
  providers: [FavouritesService],
  exports: [MongooseModule, FavouritesService],
})
export class FavouritesModule {}
