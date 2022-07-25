import { Controller, Get } from '@nestjs/common';
import { UserDataService } from './userData.service';

@Controller('user-data')
export class UserDataController {
  constructor(private readonly userService: UserDataService) {}

  @Get('/')
  getUser() {
    return 'user';
  }
}
