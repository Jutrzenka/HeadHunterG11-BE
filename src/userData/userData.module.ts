import { Module } from '@nestjs/common';
import { UserDataService } from './userData.service';
import { UserDataController } from './userData.controller';

@Module({
  controllers: [UserDataController],
  providers: [UserDataService],
})
export class UserDataModule {}
