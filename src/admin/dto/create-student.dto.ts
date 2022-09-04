import { IsArray, IsEmail, IsNumber } from 'class-validator';

export class CreateStudentDto {
  @IsEmail()
  email: string;

  @IsNumber()
  courseCompletion: number;

  @IsNumber()
  courseEngagement: number;

  @IsNumber()
  projectDegree: number;

  @IsNumber()
  teamProjectDegree: number;

  @IsArray()
  bonusProjectUrls: string[];
}
