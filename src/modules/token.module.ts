import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
//
import { Token, TokenSchema } from 'src/schemas/token.schema';
import { TokenService } from 'src/services/token.service';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Token.name,
        schema: TokenSchema,
        collection: 'tokens',
      },
    ]),
  ],
  controllers: [],
  providers: [TokenService],
  exports: [MongooseModule, TokenService],
})
export class TokenModule {}
