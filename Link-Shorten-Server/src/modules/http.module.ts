import { Module } from '@nestjs/common';
//
import { HttpService } from 'src/services/http.service';
@Module({
  imports: [],
  controllers: [],
  providers: [HttpService],
  exports: [HttpService],
})
export class HttpModule {}
