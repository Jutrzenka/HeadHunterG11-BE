import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { Response } from 'express';
import { UserObj } from '../Utils/decorators/userobj.decorator';
import { User } from './schema/user.schema';
import { JsonCommunicationType } from '../Utils/types/data/JsonCommunicationType';
import { JwtAllGuard } from './authorization-token/guard/jwtAll.guard';

@Controller('/api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() req: AuthLoginDto, @Res() res: Response): Promise<any> {
    return this.authService.login(req, res);
  }

  @Post('/logout')
  @UseGuards(JwtAllGuard)
  async logout(@UserObj() user: User, @Res() res: Response): Promise<any> {
    return this.authService.logout(user, res);
  }

  @Patch('/register/:login/:registerCode')
  async firstLogin(
    @Param() param: { login: string; registerCode: string },
    @Body()
    body: {
      newLogin: string;
      password: string;
      firstName?: string;
      lastName?: string;
    },
  ): Promise<JsonCommunicationType> {
    return await this.authService.activateFullAccount(param, body);
  }
}
