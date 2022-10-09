import { Test, TestingModule } from '@nestjs/testing';
<<<<<<< HEAD:src/admin/authorization-token/token.service.spec.ts
import { AdminTokenService } from './admin-token.service';

describe('TokenService', () => {
  let service: AdminTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminTokenService],
    }).compile();

    service = module.get<AdminTokenService>(AdminTokenService);
=======
import { AuthService } from './auth.service';

describe('UsersService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
>>>>>>> 277b2a5b3021cb90893d51030c632c4d46bd1950:src/auth/auth.service.spec.ts
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
