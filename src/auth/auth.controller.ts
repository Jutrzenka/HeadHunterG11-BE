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
import { UserRole } from '../Utils/types/user/AuthUser.type';
import { JsonCommunicationType } from '../Utils/types/data/JsonCommunicationType';

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
  ): Promise<JsonCommunicationType> {
    const { login, registerCode } = param;
    const { newLogin, password } = body;
    try {
      const data = await this.authService.register({
        login,
        newLogin,
        password,
        registerCode,
      });
      if (!data) {
        return {
          success: false,
          typeData: 'status',
          data: {
            code: 'A0002',
            message: 'Błędny link do pierwszej rejestracji',
          },
        };
      }
      return {
        success: true,
        typeData: 'status',
        data: null,
      };
    } catch (err) {
      return {
        success: false,
        typeData: 'status',
        data: { code: 'A0001', message: 'Nieznany błąd na serwerze' },
      };
    }
  }

  // Tworzenie uzytkownika - to tylko testowo. Potem będzie to wykorzystywane jedynie przez admina
  @Put('/create')
  async createUser(
    @Body() body: { email: string; role: UserRole },
  ): Promise<JsonCommunicationType> {
    const { email, role } = body;
    try {
      await this.authService.createUser({ role, email });
      return {
        success: true,
        typeData: 'status',
        data: null,
      };
    } catch (err) {
      if (err.code === 11000) {
        return {
          success: false,
          typeData: 'status',
          data: {
            code: 'A0003',
            message: 'Unikalne dane nie mogą się duplikować',
          },
        };
      }
      return {
        success: false,
        typeData: 'status',
        data: { code: 'A0001', message: 'Nieznany błąd na serwerze' },
      };
    }
  }
}
