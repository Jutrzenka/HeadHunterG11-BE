import { Test, TestingModule } from '@nestjs/testing';
<<<<<<< HEAD:src/auth/authorization-token/token.service.spec.ts
import { UserTokenService } from './user-token.service';

describe('TokenService', () => {
  let service: UserTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserTokenService],
    }).compile();

    service = module.get<UserTokenService>(UserTokenService);
=======
import { UserDataService } from './userData.service';

describe('UserService', () => {
  let service: UserDataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserDataService],
    }).compile();

    service = module.get<UserDataService>(UserDataService);
>>>>>>> 277b2a5b3021cb90893d51030c632c4d46bd1950:src/userData/userData.service.spec.ts
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
