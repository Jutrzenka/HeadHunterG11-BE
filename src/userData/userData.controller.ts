import { Controller, Get, Inject } from '@nestjs/common';
import { UserDataService } from './userData.service';
import { JsonCommunicationType } from '../Utils/types/data/JsonCommunicationType';

@Controller('/api/user')
export class UserDataController {
  constructor(
    @Inject(UserDataService)
    private userDataService: UserDataService,
  ) {}

  @Get('/students')
  async getUser(): Promise<JsonCommunicationType> {
    // Tymczasowa zwrotka
    return {
      success: false,
      typeData: 'status',
      data: { code: 'A0001', message: 'Nieznany błąd na serwerze' },
    };
  }

  @Get('/students/interviews')
  async GetInterviewsUser(): Promise<JsonCommunicationType> {
    // Tymczasowa zwrotka
    return {
      success: false,
      typeData: 'status',
      data: { code: 'A0001', message: 'Nieznany błąd na serwerze' },
    };
  }
}
