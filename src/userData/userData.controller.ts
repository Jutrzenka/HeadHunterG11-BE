import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Put,
} from '@nestjs/common';
import { UserDataService } from './userData.service';
import { JsonCommunicationType } from '../Utils/types/data/JsonCommunicationType';
import { User } from './entities/user.entity';

@Controller('/api/user')
export class UserDataController {
  constructor(
    @Inject(UserDataService)
    private userDataService: UserDataService,
  ) {}

  // @Get('/students')
  // async getUser(): Promise<JsonCommunicationType> {
  //   // Tymczasowa zwrotka
  //   return {
  //     success: false,
  //     typeData: 'status',
  //     data: { code: 'A0001', message: 'Nieznany błąd na serwerze' },
  //   };
  // }
  @Get('/students')
  getAllStudents(): Promise<JsonCommunicationType> {
    return this.userDataService.getAllStudentsForHr();
  }

  @Get('/students/interviews/:idHr')
  async GetInterviewsUser(
    @Param('idHr') idHr: string,
  ): Promise<JsonCommunicationType> {
    // Tymczasowa zwrotka
    return this.userDataService.getAllInterviewsForHr(idHr);
  }

  @Get('/:idUser')
  async getStudent(
    @Param('idUser') idUser: string,
  ): Promise<JsonCommunicationType> {
    return this.userDataService.getStudent(idUser);
  }

  @Patch('/:idUser')
  async updateStudentInfo(
    @Param('idUser') idUser: string,
    @Body() body: any,
  ): Promise<JsonCommunicationType> {
    return this.userDataService.updateStudentInfo(idUser, body);
  }

  @Delete('/students/interviews/:id/:idHr')
  async removeInterview(
    @Param('id') id: string,
    @Param('idHr') idHr: string,
  ): Promise<JsonCommunicationType> {
    return this.userDataService.removeInterviewByHr(id, idHr);
  }

  @Put('/students/interviews/:infoStudentId/:idHr')
  async addStudentToInterview(
    @Param('infoStudentId') infoStudentId: string,
    @Param('idHr') idHr: string,
  ): Promise<JsonCommunicationType> {
    return this.userDataService.addToInterview(infoStudentId, idHr);
  }
}
