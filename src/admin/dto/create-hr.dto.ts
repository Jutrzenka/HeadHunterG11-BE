import { IsEmail, IsString } from 'class-validator';

export class CreateHrDto {
  @IsEmail()
  email: string;

  @IsString()
  fullName: string;

  @IsString()
  company: string;
}
