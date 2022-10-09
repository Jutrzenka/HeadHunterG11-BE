<<<<<<< HEAD
import { IsEmail, IsString } from 'class-validator';

export class AuthLoginDto {
  @IsEmail()
  email: string;
  @IsString()
=======
export class AuthLoginDto {
  email: string;
>>>>>>> 277b2a5b3021cb90893d51030c632c4d46bd1950
  pwd: string;
}
