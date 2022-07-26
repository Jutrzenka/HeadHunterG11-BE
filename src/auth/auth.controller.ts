import { Body, Controller, Delete, Patch, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: AuthService) {}

  // Przyjmowanie danych z formularza i odesłanie tokenu JWT
  @Post('/login')
  async login(@Body() req: AuthLoginDto, @Res() res: Response) {
    return this.usersService.login(req, res);
  }

  // Wylogowywanie - resetowanie tokenów itd.
  @Delete('/logout')
  logout() {
    return 'Wylogowanie';
  }

  // Pierwsze logowanie. Umieszczanie hasła, idUser, roli
  @Patch('/register')
  firstLogin() {
    return 'Pierwsze logowanie';
  }
}
