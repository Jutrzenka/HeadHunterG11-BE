import {
  ContractType,
  Status,
  TypeWork,
} from '../../Utils/types/user/Student.type';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumber,
  IsString,
} from 'class-validator';

export class UpdateStudentDto {
  @IsEnum(Status)
  status?: Status;

  @IsEmail()
  email?: string;

  @IsString()
  firstName?: string;

  @IsString()
  lastName?: string;

  @IsNumber()
  tel?: number;

  @IsString()
  githubUsername?: string;

  @IsArray()
  portfolioUrls?: string[];

  @IsArray()
  projectUrls?: string[];

  @IsString()
  bio?: string;

  @IsEnum(TypeWork)
  expectedTypeWork?: TypeWork;

  @IsString()
  targetWorkCity?: string;

  @IsEnum(ContractType)
  expectedContractType?: ContractType;

  @IsNumber()
  expectedSalary?: number;

  @IsBoolean()
  canTakeApprenticeship?: boolean;

  @IsNumber()
  monthsOfCommercialExp?: number;

  @IsString()
  education?: string;

  @IsString()
  workExperience?: string;

  @IsString()
  courses?: string;
}
