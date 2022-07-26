import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserDataService } from './userData.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('user-data')
export class UserDataController {
  constructor(private readonly userService: UserDataService) {}

  @Get('/')
  @UseGuards(AuthGuard('jwt'))
  getUser() {
    return 'user';
  }
}
