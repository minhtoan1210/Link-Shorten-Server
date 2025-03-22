import {
  CanActivate,
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { TokenPayloadDto } from 'src/dtos/auth.dto';
import { HttpService } from 'src/services/http.service';
import { TokenService } from 'src/services/token.service';
require('dotenv').config();
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private httpService: HttpService,
    private tokenService: TokenService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const headers = request.headers;
    if (headers.authorization) {
      try {
        let token = headers.authorization.replace('Bearer ', '');
        // Check logged in
        if (!token) {
          throw new UnauthorizedException('You are not logged in.');
        }
        let payload: TokenPayloadDto = this.jwtService.verify(token, {
          secret: process.env.ACCESS_TOKEN_SECRET,
        });
        if (!payload) {
          throw new HttpException(
            'Invalid or missing payload in token.',
            HttpStatus.BAD_REQUEST,
          );
        }
        request.user = payload.user;

        // Check if IP matched with stored token
        let ip = this.httpService.getClientIp(request);
        let isIpMatched = await this.tokenService.isIpMatched(
          token,
          'access',
          ip,
        );
        if (isIpMatched == false) {
          throw new BadRequestException(
            'Access token is already using at another place. Please login and try again.',
          );
        }
        return true;
      } catch (error) {
        if (error instanceof TokenExpiredError) {
          throw new HttpException(
            'Access token is expired.',
            HttpStatus.BAD_REQUEST,
          );
        } else {
          throw new HttpException(error.message, error.status);
        }
      }
    }
    throw new UnauthorizedException('Unauthorized.');
  }
}
