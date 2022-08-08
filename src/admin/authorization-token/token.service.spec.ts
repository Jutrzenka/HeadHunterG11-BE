import { Test, TestingModule } from '@nestjs/testing';
import { AdminTokenService } from './admin-token.service';

describe('TokenService', () => {
  let service: AdminTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminTokenService],
    }).compile();

    service = module.get<AdminTokenService>(AdminTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
