import { Controller, Post, Put } from '@nestjs/common';
//import { UserRole } from '../Utils/types/user/AuthUser.type';
import { JsonCommunicationType } from '../Utils/types/data/JsonCommunicationType';

@Controller('auth')
export class AdminController {
  // Przyjmowanie danych z formularza i odesłanie tokenu JWT
  @Post('/login')
  async login() {
    return 'Login';
  }

  // Wylogowywanie - resetowanie tokenów itd.
  @Post('/logout')
  async logout() {
    return 'Logout';
  }

  // Tworzenie uzytkownika - to tylko testowo. Potem będzie to wykorzystywane jedynie przez admina
  @Put('/create')
  async createUser(): //@Body() body: { email: string; role: UserRole },
  Promise<JsonCommunicationType> {
    //const { email, role } = body;
    try {
      //await this.authService.createUser({ role, email });
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