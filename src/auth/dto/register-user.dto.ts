import { IsString } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  newLogin: string;
  @IsString()
  password: string;
}
