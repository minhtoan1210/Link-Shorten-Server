import { Module } from '@nestjs/common';
//
import { HttpModule } from 'src/modules/http.module';
import { TokenModule } from 'src/modules/token.module';
import { AuthGuard } from 'src/guards/auth.guard';
import { AdminGuard } from 'src/guards/admin.guard';
@Module({
  imports: [HttpModule, TokenModule],
  controllers: [],
  providers: [AuthGuard, AdminGuard],
  exports: [AuthGuard, AdminGuard, HttpModule, TokenModule],
})
export class GuardModule {}
