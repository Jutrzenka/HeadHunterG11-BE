import { Controller, Delete, Patch, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: AuthService) {}

  // Przyjmowanie danych z formularza i odesłanie tokenu JWT
  @Post('/login')
  login() {
    return 'Logowanie';
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
