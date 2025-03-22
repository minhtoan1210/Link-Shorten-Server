import {
  CanActivate,
  Injectable,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

require('dotenv').config();
@Injectable()
export class AdminGuard implements CanActivate {
  constructor() {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    let user = request.user;
    if (!user) {
      throw new BadRequestException('Missing user information in token.');
    } else {
      if (user.type != 'admin') {
        throw new BadRequestException('Only administrators can interact.');
      }
      return true;
    }
  }
}
