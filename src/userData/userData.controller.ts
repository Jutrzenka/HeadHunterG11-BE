import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserDataService } from './userData.service';
import { JsonCommunicationType } from '../Utils/types/data/JsonCommunicationType';
import { JwtHrGuard } from 'src/auth/authorization-token/guard/jwtHr.guard';
import { JwtStudentGuard } from '../auth/authorization-token/guard/jwtStudent.guard';
import { UserObj } from '../Utils/decorators/userobj.decorator';
import { User } from '../auth/schema/user.schema';
import { UpdateStudentDto } from './dto/update-student.dto';
import { FilterStudents } from '../Utils/types/user/Student.type';

@Controller('/api/user')
export class UserDataController {
  constructor(
    @Inject(UserDataService)
    private userDataService: UserDataService,
  ) {}

  //////////////////////////////////////HR

  @Get('/students')
  @UseGuards(JwtHrGuard)
  getAllStudents(
    @Query('page') page?: number,
    @Query('elements') elements?: number,
    @Query() filter?: FilterStudents,
  ): Promise<JsonCommunicationType> {
    return this.userDataService.getAllStudentsForHr(page, elements, filter);
  }

  @Get('/students/interviews')
  @UseGuards(JwtHrGuard)
  async GetInterviewsUser(
    @UserObj() user: User,
    @Query('page') page?: number,
    @Query('elements') elements?: number,
  ): Promise<JsonCommunicationType> {
    return this.userDataService.getAllInterviewsForHr(user, page, elements);
  }

  @Get('/students/:idUser')
  @UseGuards(JwtHrGuard)
  async getStudentForHr(
    @Param('idUser') idUser: string,
  ): Promise<JsonCommunicationType> {
    return this.userDataService.getStudentForHr(idUser);
  }

  @Delete('/students/interviews/:id')
  @UseGuards(JwtHrGuard)
  async removeInterview(
    @UserObj() user: User,
    @Param('id') id: string,
  ): Promise<JsonCommunicationType> {
    return this.userDataService.removeInterviewByHr(user, id);
  }

  @Put('/students/interviews/:studentId')
  @UseGuards(JwtHrGuard)
  async addStudentToInterview(
    @UserObj() user: User,
    @Param('studentId') studentId: string,
  ): Promise<JsonCommunicationType> {
    return this.userDataService.addToInterview(user, studentId);
  }

  @Patch('/students/:studentId')
  @UseGuards(JwtHrGuard)
  async employStudent(
    @UserObj() user: User,
    @Param('studentId') studentId: string,
  ): Promise<JsonCommunicationType> {
    return this.userDataService.employStudent(user, studentId);
  }

  ////////////////////////////////////////////// STUDENT

  @Get('/student')
  @UseGuards(JwtStudentGuard)
  getStudent(@UserObj() user: User): Promise<JsonCommunicationType> {
    return this.userDataService.getStudent(user);
  }

  @Patch('/student')
  @UseGuards(JwtStudentGuard)
  async updateStudentInfo(
    @UserObj() user: User,
    @Body() body: UpdateStudentDto,
    @Res() res?: Response,
  ): Promise<JsonCommunicationType> {
    return this.userDataService.updateStudentInfo(user, body, res);
  }
}
