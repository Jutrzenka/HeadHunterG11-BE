import { IsString } from 'class-validator';

export class AdminAuthLoginDto {
  @IsString()
  login: string;

  @IsString()
  pwd: string;
}
