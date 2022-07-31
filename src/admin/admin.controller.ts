import {
  Body,
  Controller,
  Get,
  HostParam,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { JsonCommunicationType } from '../Utils/types/data/JsonCommunicationType';
import { AdminService } from './admin.service';
import { Response } from 'express';

@Controller('/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  // Przyjmowanie danych z formularza i odesłanie tokenu JWT
  @Post('/login')
  async login(
    @Body() req: { email: string; pwd: string },
    @Res() res: Response,
  ) {
    // return this.adminService.login(req, res);
  }

  // Wylogowywanie - resetowanie tokenów itd.
  @Get('/logout')
  async logout(@HostParam('subdomain') account: string) {
    console.log(account);
    return account;
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
