import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JsonCommunicationType } from '../Utils/types/data/JsonCommunicationType';
import { AdminService } from './admin.service';
import { UserRole } from 'src/Utils/types/export';
import { AdminAuthService } from './admin-auth.service';
import { validateEmail } from '../Utils/function/validateEmail';
import {
  generateErrorResponse,
  generateSuccessResponse,
} from '../Utils/function/generateJsonResponse/generateJsonResponse';
import { Response } from 'express';
import { AdminAuthLoginDto } from './dto/admin-auth-login.dto';
import { UserObj } from '../Utils/decorators/userobj.decorator';
import { Admin } from './schema/admin.schema';
import { JwtAdminGuard } from './authorization-token/guard/jwtAdmin.guard';

@Controller('/api/admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly adminAuthService: AdminAuthService,
  ) {}

  @Post('/auth/login')
  async login(
    @Body() req: AdminAuthLoginDto,
    @Res() res: Response,
  ): Promise<any> {
    return this.adminAuthService.adminLogin(req, res);
  }

  // Wylogowywanie - resetowanie tokenów itd.
  @Post('/auth/logout')
  @UseGuards(JwtAdminGuard)
  async logout(@UserObj() admin: Admin, @Res() res: Response): Promise<any> {
    return this.adminAuthService.adminLogout(admin, res);
  }

  @Get('/students')
  @UseGuards(JwtAdminGuard)
  async allStudents(
    @Body() body: { filter: string; limit: number; page: number },
  ): Promise<JsonCommunicationType> {
    const { filter, limit, page } = body;
    if (limit > 50 || limit < 1 || page < 1) {
      return generateErrorResponse('C002');
    }
    return this.adminService.getAllStudents({
      filter,
      limit,
      page,
    });
  }

  @Get('/headhunters')
  @UseGuards(JwtAdminGuard)
  async allHeadhunters(
    @Body() body: { filter: string; limit: number; page: number },
  ): Promise<JsonCommunicationType> {
    const { filter, limit, page } = body;
    if (limit > 50 || limit < 1 || page < 1) {
      return generateErrorResponse('C002');
    }
    return this.adminService.getAllHeadhunters({
      filter,
      limit,
      page,
    });
  }

  @Delete('/user/:id')
  @UseGuards(JwtAdminGuard)
  async deleteUser(): Promise<JsonCommunicationType> {
    return this.adminService.deleteUser();
  }

  // Pamiętać o zresetowaniu registerCode i wysłaniu ponownie e-maila
  @Patch('/user/:id')
  @UseGuards(JwtAdminGuard)
  async editEmailUser(): Promise<JsonCommunicationType> {
    return this.adminService.editEmail();
  }

  @Post('/user/:id')
  @UseGuards(JwtAdminGuard)
  async newRegisterCode(): Promise<JsonCommunicationType> {
    return this.adminService.newRegisterCode();
  }

  // Tworzenie użytkownika
  @Put('/create')
  @UseGuards(JwtAdminGuard)
  async createOneUser(
    @Body() body: { email: string; role: UserRole },
  ): Promise<JsonCommunicationType> {
    const { email, role } = body;
    if (
      !role ||
      (role !== UserRole.Student && role !== UserRole.HeadHunter) ||
      !validateEmail(email)
    ) {
      return generateErrorResponse('C002');
    }
    try {
      await this.adminService.createUser({ email, role });
      return generateSuccessResponse();
    } catch (err) {
      if (err.code === 11000) {
        return generateErrorResponse('C001');
      }
      return generateErrorResponse('A000');
    }
  }

  @Put('/create/csv')
  @UseGuards(JwtAdminGuard)
  async createCsvUser(): Promise<JsonCommunicationType> {
    // TODO zapętlić: await this.adminService.createUser({ email, role });
    // Tymczasowa zwrotka
    return generateErrorResponse('B000');
  }

  @Put('/create/json')
  @UseGuards(JwtAdminGuard)
  async createJsonUser(): Promise<JsonCommunicationType> {
    // TODO zapętlić: await this.adminService.createUser({ email, role });
    // Tymczasowa zwrotka
    return generateErrorResponse('B000');
  }
}
