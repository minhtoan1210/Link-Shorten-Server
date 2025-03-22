import {
  Controller,
  Get,
  Param,
  Post,
  Patch,
  Delete,
  Body,
  HttpException,
  UseGuards,
} from '@nestjs/common';
//
import { UserInvitationService } from 'src/services/user_invitation.service';
//
@Controller('invitation')
export class UserInvitationController {
  constructor(private readonly invitationService: UserInvitationService) {}
}
