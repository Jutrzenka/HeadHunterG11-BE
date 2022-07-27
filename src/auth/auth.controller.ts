import { Body, Controller, Patch, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { Response } from 'express';
import { UserObj } from '../Utils/decorators/userobj.decorator';
import { User } from '../Utils/schema/user.schema';
import { AuthGuard } from '@nestjs/passport';
import { UserDataService } from '../userData/userData.service';
import { v4 as uuid } from 'uuid';
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
  @Patch('/register')
  async firstLogin(
    @Body() body: { email: string; role: UserRole; password: string },
  ) {
    const idUser = uuid();
    const { email, role, password } = body;
    await this.authService.register(idUser, role, email, password);
    return await this.userData.register();
  }
}
