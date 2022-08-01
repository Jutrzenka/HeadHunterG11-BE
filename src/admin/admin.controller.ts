import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { JsonCommunicationType } from '../Utils/types/data/JsonCommunicationType';
import { AdminService } from './admin.service';
import { UserRole } from 'src/Utils/types/export';
import { AuthService } from '../auth/auth.service';
import { UserDataService } from 'src/userData/userData.service';
import { AdminAuthService } from './admin-auth.service';

@Controller('/api/admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly adminAuthService: AdminAuthService,
    private readonly authService: AuthService,
    private readonly userService: UserDataService,
  ) {}

  @Post('/auth/login')
  async login(): Promise<JsonCommunicationType> {
    this.adminAuthService.login();
    // Tymczasowa zwrotka
    return {
      success: false,
      typeData: 'status',
      data: { code: 'A0001', message: 'Nieznany błąd na serwerze' },
    };
  }

  // Wylogowywanie - resetowanie tokenów itd.
  @Post('/auth/logout')
  async logout(): Promise<JsonCommunicationType> {
    this.adminAuthService.logout();
    // Tymczasowa zwrotka
    return {
      success: false,
      typeData: 'status',
      data: { code: 'A0001', message: 'Nieznany błąd na serwerze' },
    };
  }

  @Get('/students')
  async allStudents(): Promise<JsonCommunicationType> {
    this.userService.getAllStudents();
    // Tymczasowa zwrotka
    return {
      success: false,
      typeData: 'status',
      data: { code: 'A0001', message: 'Nieznany błąd na serwerze' },
    };
  }

  @Get('/headhunters')
  async allHeadhunters(): Promise<JsonCommunicationType> {
    this.userService.getAllHeadhunters();
    // Tymczasowa zwrotka
    return {
      success: false,
      typeData: 'status',
      data: { code: 'A0001', message: 'Nieznany błąd na serwerze' },
    };
  }

  @Delete('/user/:id')
  async deleteUser(): Promise<JsonCommunicationType> {
    this.userService.deleteUser();
    // Tymczasowa zwrotka
    return {
      success: false,
      typeData: 'status',
      data: { code: 'A0001', message: 'Nieznany błąd na serwerze' },
    };
  }

  // Pamiętać o zresetowaniu registerCode i wysłaniu ponownie e-maila
  @Patch('/user/:id')
  async editEmailUser(): Promise<JsonCommunicationType> {
    this.authService.editEmail();
    // Tymczasowa zwrotka
    return {
      success: false,
      typeData: 'status',
      data: { code: 'A0001', message: 'Nieznany błąd na serwerze' },
    };
  }

  @Post('/user/:id')
  async newRegisterCode(): Promise<JsonCommunicationType> {
    this.authService.newRegisterCode();
    return {
      success: false,
      typeData: 'status',
      data: { code: 'A0001', message: 'Nieznany błąd na serwerze' },
    };
  }

  // Tworzenie użytkownika
  @Put('/create')
  async createOneUser(
    @Body() body: { email: string; role: UserRole },
  ): Promise<JsonCommunicationType> {
    const { email, role } = body;
    try {
      await this.adminService.createUser({ email, role });
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

  @Put('/create/csv')
  async createCsvUser(): Promise<JsonCommunicationType> {
    // TODO zapętlić: await this.adminService.createUser({ email, role });
    // Tymczasowa zwrotka
    return {
      success: false,
      typeData: 'status',
      data: { code: 'A0001', message: 'Nieznany błąd na serwerze' },
    };
  }

  @Put('/create/json')
  async createJsonUser(): Promise<JsonCommunicationType> {
    // TODO zapętlić: await this.adminService.createUser({ email, role });
    // Tymczasowa zwrotka
    return {
      success: false,
      typeData: 'status',
      data: { code: 'A0001', message: 'Nieznany błąd na serwerze' },
    };
  }
}
