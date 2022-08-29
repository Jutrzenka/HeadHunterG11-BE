import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AdminService } from './admin.service';
import {
  JsonCommunicationType,
  ReceivedFiles,
  UserRole,
} from 'src/Utils/types/export';
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
import { storageDir } from 'src/Utils/function/storageDir';
import { CreateHrDto } from './dto/create-hr.dto';

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
  ): Promise<Response> {
    return this.adminAuthService.adminLogin(req, res);
  }

  @Post('/auth/logout')
  @UseGuards(JwtAdminGuard)
  async logout(
    @UserObj() admin: Admin,
    @Res() res: Response,
  ): Promise<Response> {
    return this.adminAuthService.adminLogout(admin, res);
  }

  @Get('/students')
  @UseGuards(JwtAdminGuard)
  async allStudents(
    @Body()
    { filter, limit, page }: { filter: string; limit: number; page: number },
  ): Promise<JsonCommunicationType> {
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
    @Body()
    { filter, limit, page }: { filter: string; limit: number; page: number },
  ): Promise<JsonCommunicationType> {
    if (limit > 50 || limit < 1 || page < 1) {
      return generateErrorResponse('C002');
    }
    return this.adminService.getAllHeadhunters({
      filter,
      limit,
      page,
    });
  }

  @Delete('/user/:idUser')
  @UseGuards(JwtAdminGuard)
  async deleteUser(
    @Param() { idUser }: { idUser: string },
  ): Promise<JsonCommunicationType> {
    if (!idUser || idUser.length !== 36) {
      return generateErrorResponse('C004');
    }
    return this.adminService.deleteUser(idUser);
  }

  // Pamiętać o zresetowaniu registerCode i wysłaniu ponownie e-maila
  @Patch('/user/:idUser')
  @UseGuards(JwtAdminGuard)
  async editEmailUser(
    @Param() { idUser }: { idUser: string },
    @Body() { email }: { email: string },
  ): Promise<JsonCommunicationType> {
    if (!validateEmail(email)) {
      return generateErrorResponse('C002');
    }
    if (!idUser || idUser.length !== 36) {
      return generateErrorResponse('C004');
    }
    return this.adminService.editEmail(idUser, email);
  }

  @Post('/user/:idUser')
  @UseGuards(JwtAdminGuard)
  async newPassword(
    @Param() { idUser }: { idUser: string },
  ): Promise<JsonCommunicationType> {
    if (!idUser || idUser.length !== 36) {
      return generateErrorResponse('C004');
    }
    return this.adminService.newPassword(idUser);
  }

  // Tworzenie użytkownika
  @Put('/create')
  @UseGuards(JwtAdminGuard)
  async createOneUser(
    @Body() { email, role }: { email: string; role: UserRole },
  ): Promise<JsonCommunicationType> {
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

  @Post('/create/hr')
  @UseGuards(JwtAdminGuard)
  async createHr(@Body() body: CreateHrDto): Promise<JsonCommunicationType> {
    try {
      await this.adminService.createHr(body);
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
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'user-json', maxCount: 1 }], {
      dest: storageDir('JsonUser'),
    }),
  )
  async createJsonStudents(
    @UploadedFiles() files: ReceivedFiles,
  ): Promise<JsonCommunicationType> {
    if (
      !files['user-json'] ||
      files['user-json'][0].mimetype !== 'application/json'
    )
      return generateErrorResponse('E000');
    return await this.adminService.createStudentsJson(files);
  }
}
