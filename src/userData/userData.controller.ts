import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { UserDataService } from './userData.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserDataController {
  constructor(
    @Inject(UserDataService) private userDataService: UserDataService,
  ) {}
  //localhost:3000/user/student
  @Get('/student')
  @UseGuards(AuthGuard('jwtStudent'))
  getUser() {
    return 'user';
  }
  //localhost:3000/user/hr
  @Get('/hr')
  @UseGuards(AuthGuard('jwtHr'))
  getHr() {
    return 'Hr';
  }
}
