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
import { AdminAuthService } from './admin-auth.service';
import { validateEmail } from '../Utils/function/validateEmail';

@Controller('/api/admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly adminAuthService: AdminAuthService,
  ) {}

  @Post('/auth/login')
  async login(): Promise<JsonCommunicationType> {
    return this.adminAuthService.login();
  }

  // Wylogowywanie - resetowanie tokenów itd.
  @Post('/auth/logout')
  async logout(): Promise<JsonCommunicationType> {
    return this.adminAuthService.logout();
  }

  @Get('/students')
  async allStudents(
    @Body() body: { filter: string; limit: number; page: number },
  ): Promise<JsonCommunicationType> {
    const { filter, limit, page } = body;
    if (limit > 50 || limit < 1 || page < 1) {
      return {
        success: false,
        typeData: 'status',
        data: { code: 'A0001', message: 'Błędne body' },
      };
    }
    return this.adminService.getAllStudents({
      filter,
      limit,
      page,
    });
  }

  @Get('/headhunters')
  async allHeadhunters(
    @Body() body: { filter: string; limit: number; page: number },
  ): Promise<JsonCommunicationType> {
    const { filter, limit, page } = body;
    if (limit > 50 || limit < 1 || page < 1) {
      return {
        success: false,
        typeData: 'status',
        data: { code: 'A0001', message: 'Błędne body' },
      };
    }
    return this.adminService.getAllHeadhunters({
      filter,
      limit,
      page,
    });
  }

  @Delete('/user/:id')
  async deleteUser(): Promise<JsonCommunicationType> {
    return this.adminService.deleteUser();
  }

  // Pamiętać o zresetowaniu registerCode i wysłaniu ponownie e-maila
  @Patch('/user/:id')
  async editEmailUser(): Promise<JsonCommunicationType> {
    return this.adminService.editEmail();
  }

  @Post('/user/:id')
  async newRegisterCode(): Promise<JsonCommunicationType> {
    return this.adminService.newRegisterCode();
  }

  // Tworzenie użytkownika
  @Put('/create')
  async createOneUser(
    @Body() body: { email: string; role: UserRole },
  ): Promise<JsonCommunicationType> {
    const { email, role } = body;
    if (
      !role ||
      (role !== UserRole.Student && role !== UserRole.HeadHunter) ||
      !validateEmail(email)
    ) {
      return {
        success: false,
        typeData: 'status',
        data: {
          code: 'A0003',
          message: 'Błędne dane',
        },
      };
    }
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
