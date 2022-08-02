import { Body, Controller, Get, Param, Patch, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { Response } from 'express';
import { UserObj } from '../Utils/decorators/userobj.decorator';
import { User } from './schema/user.schema';
import { JsonCommunicationType } from '../Utils/types/data/JsonCommunicationType';
import { UserDataService } from 'src/userData/userData.service';

@Controller('/api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userDataService: UserDataService,
  ) {}

  // Przyjmowanie danych z formularza i odesłanie tokenu JWT
  @Post('/login')
  async login(
    @Body() req: AuthLoginDto,
    @Res() res: Response,
  ): Promise<JsonCommunicationType> {
    this.authService.login(req, res);
    // Tymczasowa zwrotka
    return {
      success: false,
      typeData: 'status',
      data: { code: 'A0001', message: 'Nieznany błąd na serwerze' },
    };
  }

  // Wylogowywanie - resetowanie tokenów itd.
  @Get('/logout')
  async logout(
    @UserObj() user: User,
    @Res() res: Response,
  ): Promise<JsonCommunicationType> {
    this.authService.logout(user, res);
    // Tymczasowa zwrotka
    return {
      success: false,
      typeData: 'status',
      data: { code: 'A0001', message: 'Nieznany błąd na serwerze' },
    };
  }

  @Patch('/register/:login/:registerCode')
  async firstLogin(
    @Param() param: { login: string; registerCode: string },
    @Body()
    body: {
      newLogin: string;
      password: string;
      firstName: string;
      lastName: string;
    },
  ): Promise<JsonCommunicationType> {
    return await this.authService.activateFullAccount(param, body);
  }
}
