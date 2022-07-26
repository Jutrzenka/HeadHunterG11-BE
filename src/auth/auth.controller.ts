import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { Response } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { UserObj } from '../decorators/userobj.decorator';
import { User } from '../Utils/schema/user.schema';

@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: AuthService) {}

  // Przyjmowanie danych z formularza i odesłanie tokenu JWT
  @Post('/login')
  async login(@Body() req: AuthLoginDto, @Res() res: Response) {
    return this.usersService.login(req, res);
  }

  // Wylogowywanie - resetowanie tokenów itd.
  @Get('/logout')
  @UseGuards(AuthGuard('jwt'))
  async logout(@UserObj() user: User, @Res() res: Response) {
    return this.usersService.logout(user, res);
  }

  // Pierwsze logowanie. Umieszczanie hasła, idUser, roli
  @Patch('/register')
  firstLogin() {
    return 'Pierwsze logowanie';
  }
}
