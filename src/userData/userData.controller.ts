import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { UserDataService } from './userData.service';
import { AuthGuard } from '@nestjs/passport';
import { JsonCommunicationType } from '../Utils/types/data/JsonCommunicationType';

@Controller('/api/user')
export class UserDataController {
  constructor(
    @Inject(UserDataService) private userDataService: UserDataService,
  ) {}

  @Get('/student')
  @UseGuards(AuthGuard('jwtStudent'))
  async getUser(): Promise<JsonCommunicationType> {
    return 'user';
  }

  @Get('/hr')
  @UseGuards(AuthGuard('jwtHr'))
  async getHr(): Promise<JsonCommunicationType> {
    return 'Hr';
  }
}
