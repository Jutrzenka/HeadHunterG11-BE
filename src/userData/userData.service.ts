import { Injectable } from '@nestjs/common';

@Injectable()
export class UserDataService {
  async register() {
    return 'Tu rejestrować';
  }
}
