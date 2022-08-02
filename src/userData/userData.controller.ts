import { Controller, Get, Inject, Param } from '@nestjs/common';
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
}
