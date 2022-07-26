import { Test, TestingModule } from '@nestjs/testing';
import { UserDataService } from './userData.service';

describe('UserService', () => {
  let service: UserDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserDataService],
    }).compile();

    service = module.get<UserDataService>(UserDataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
