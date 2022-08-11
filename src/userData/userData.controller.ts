import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserDataService } from './userData.service';
import { JsonCommunicationType } from '../Utils/types/data/JsonCommunicationType';
import { JwtHrGuard } from 'src/auth/authorization-token/guard/jwtHr.guard';
import { JwtStudentGuard } from '../auth/authorization-token/guard/jwtStudent.guard';

@Controller('/api/user')
export class UserDataController {
  constructor(
    @Inject(UserDataService)
    private userDataService: UserDataService,
  ) {}

  @Get('/students')
  @UseGuards(JwtHrGuard)
  getAllStudents(): Promise<JsonCommunicationType> {
    return this.userDataService.getAllStudentsForHr();
  }

  @Get('/students/interviews')
  @UseGuards(JwtHrGuard)
  async GetInterviewsUser(
    // @TODO Zamienić Param na UserObj
    @Param('idHr') idHr: string,
  ): Promise<JsonCommunicationType> {
    // Tymczasowa zwrotka
    return this.userDataService.getAllInterviewsForHr(idHr);
  }

  // @TODO Zdublować i zrobić dla Studenta
  @Get('/students/:idUser')
  @UseGuards(JwtHrGuard)
  async getStudent(
    @Param('idUser') idUser: string,
  ): Promise<JsonCommunicationType> {
    return this.userDataService.getStudent(idUser);
  }

  // @TODO Zamienić Param na UserObj
  @Patch('/students')
  @UseGuards(JwtStudentGuard)
  async updateStudentInfo(
    @Param('idUser') idUser: string,
    @Body() body: any,
  ): Promise<JsonCommunicationType> {
    return this.userDataService.updateStudentInfo(idUser, body);
  }

  // @TODO Zamienić Param na UserObj
  @Delete('/students/interviews/:id')
  @UseGuards(JwtHrGuard)
  async removeInterview(
    @Param('id') id: string,
    @Param('idHr') idHr: string,
  ): Promise<JsonCommunicationType> {
    return this.userDataService.removeInterviewByHr(id, idHr);
  }

  // @TODO Zamienić Param na UserObj
  @Put('/students/interviews/:infoStudentId')
  @UseGuards(JwtHrGuard)
  async addStudentToInterview(
    @Param('infoStudentId') infoStudentId: string,
    @Param('idHr') idHr: string,
  ): Promise<JsonCommunicationType> {
    return this.userDataService.addToInterview(infoStudentId, idHr);
  }
}
