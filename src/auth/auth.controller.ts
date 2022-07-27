import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { Response } from 'express';
import { UserObj } from '../Utils/decorators/userobj.decorator';
import { User } from '../Utils/schema/user.schema';
import { AuthGuard } from '@nestjs/passport';
import { UserDataService } from '../userData/userData.service';
import { UserRole } from '../Utils/types/user/authUser';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userData: UserDataService,
  ) {}

  // Przyjmowanie danych z formularza i odesłanie tokenu JWT
  @Post('/login')
  async login(@Body() req: AuthLoginDto, @Res() res: Response) {
    return this.authService.login(req, res);
  }

  // Wylogowywanie - resetowanie tokenów itd.
  @Post('/logout')
  @UseGuards(AuthGuard(['jwtStudent', 'jwtHr']))
  async logout(@UserObj() user: User, @Res() res: Response) {
    return this.authService.logout(user, res);
  }

  // Pierwsze logowanie. Umieszczanie hasła, idUser, roli
  @Patch('/register/:login/:registerCode')
  async firstLogin(
    @Param() param: { login: string; registerCode: string },
    @Body() body: { newLogin: string; password: string },
  ) {
    const { login, registerCode } = param;
    const { newLogin, password } = body;
    return this.authService.register({
      login,
      newLogin,
      password,
      registerCode,
    });
  }

  // Tworzenie uzytkownika - to tylko testowo. Potem będzie to wykorzystywane jedynie przez admina
  @Put('/create')
  async createUser(@Body() body: { email: string; role: UserRole }) {
    const { email, role } = body;
    try {
      await this.authService.createUser({ role, email });
      return { success: true };
    } catch (err) {
      console.log(err);
      return { success: false };
    }
  }
}
