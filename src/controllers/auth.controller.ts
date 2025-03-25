import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Headers,
  Body,
  Request,
  HttpException,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
//
import {
  AuthLoginDto,
  AuthTokenDto,
  ResetPasswordDto,
} from 'src/dtos/auth.dto';
//
import { AuthService } from 'src/services/auth.service';
import { HttpService } from 'src/services/http.service';
import { ResetCodeService } from 'src/services/resetCode.service';
import { TokenService } from 'src/services/token.service';
import { UserService } from 'src/services/user.service';
import { MailService } from 'src/services/mail.service';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private httpService: HttpService,
    private tokenService: TokenService,
    private userService: UserService,
    private resetCodeService: ResetCodeService,
    private mailService: MailService,
  ) {}
  //#region POST Login
  @Post('login')
  async login(
    @Body() body: AuthLoginDto,
    @Request() request: any,
  ): Promise<AuthTokenDto> {
    try {
      if (!body) {
        throw new BadRequestException('Invalid request body.');
      }
      let ip = await this.httpService.getClientIp(request);
      let location = await this.httpService.getLocationByIp(ip);

      console.log("ip", ip)
      console.log("location", location)
      console.log("body", body)

      let response = await this.authService.login(
        body.email,
        body.password,
        ip,
        location,
      );
      return response;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  //#endregion

  //#region GET Refresh
  @Get('refresh')
  async refresh(
    @Headers() headers: any,
    @Request() request: any,
  ): Promise<AuthTokenDto | any> {
    try {
      // Get token
      let token = headers['refresh-token'];
      if (!token) {
        throw new BadRequestException(
          'Missing refresh-token in request headers.',
        );
      }
      token = token.replace('Bearer ', '');
      // Check client IP if matched with the one stored in database
      let ip = await this.httpService.getClientIp(request);
      let isIpMatched = await this.tokenService.isIpMatched(
        token,
        'refresh',
        ip,
      );
      if (isIpMatched == false) {
        throw new BadRequestException(
          'Refresh token is already using at another place. Please login and try again.',
        );
      }
      let response = await this.authService.refresh(token, ip);
      return response;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  //#endregion

  //#region DELETE Logout
  @Delete('logout')
  async logout(@Request() request: any) {
    try {
      let access_token = request.headers['Authorization'];
      access_token = access_token.replace('Bearer ', '');
      let refresh_token = request.headers['Refresh-token'];
      refresh_token = refresh_token.replace('Bearer ', '');
      await this.tokenService.delete(access_token, 'access');
      await this.tokenService.delete(refresh_token, 'refresh');
      return { data: true };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  //#endregion

  //#region GET Google login
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleLogin() {}
  //#endregion

  //#region GET Google login callback
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Request() request: any) {
    try {
      let google_profile = request.user.profile;
      let email = google_profile.emails[0].value;

      let user: any = await this.userService.findByEmail(email);
      if (!user) {
        let password = this.userService.generateRandomPassword();
        let body = {
          fullname: google_profile.name.familyName,
          email: email,
          password: password,
          confirm_password: password,
          google_id: google_profile.id,
        };
        user = await this.userService.create(body);
      }

      let ip = await this.httpService.getClientIp(request);
      let location = await this.httpService.getLocationByIp(ip);

      let payload = await this.tokenService.generateTokenPayload(user);
      let jwt = await this.authService.generate(payload, ip, location);
      return jwt;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  //#endregion

  //#region POST Send reset code to email
  @Post('send-reset-code')
  async sendResetCode(@Body() body: { email: string }): Promise<any> {
    try {
      let isEmailExisted = await this.authService.isExisted(body.email);

      if (!isEmailExisted) {
        throw new BadRequestException('Email is not existed.');
      }

      let code = await this.resetCodeService.create(body.email);
      let sent = await this.mailService.sendResetCode(body.email, code.value);
      return {
        data: sent,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  //#endregion

  //#region POST Check reset code
  @Post('check-reset-code')
  async checkResetCode(
    @Body() body: { email: string; value: string },
  ): Promise<any> {
    try {
      let isValid = await this.resetCodeService.isValid(body);
      return {
        data: isValid,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  //#endregion

  //#region PATCH Reset password
  @Patch('reset-password')
  async resetPassword(@Body() body: ResetPasswordDto): Promise<any> {
    try {
      let isValid = await this.resetCodeService.isValid({
        email: body.email,
        value: body.code,
      });
      if (isValid == false) {
        throw new BadRequestException('Invalid reset code.');
      }

      if (body.new_password != body.confirm_new_password) {
        throw new BadRequestException(
          "Confirm don't matched with new password.",
        );
      }
      let result = await this.authService.resetPassword(body);
      return {
        data: result,
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  //#endregion
}
