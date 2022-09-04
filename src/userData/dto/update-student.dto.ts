import {
  ContractType,
  Status,
  TypeWork,
} from '../../Utils/types/user/Student.type';

export class UpdateStudentDto {
  status?: Status;
  firstName?: string;
  lastName?: string;
  bonusProjectUrls?: string;
  tel?: number;
  githubUsername?: string;
  portfolioUrls?: string;
  projectUrls?: string;
  bio?: string;
  expectedTypeWork?: TypeWork;
  targetWorkCity?: string;
  expectedContractType?: ContractType;
  expectedSalary?: number;
  canTakeApprenticeship?: boolean;
  monthsOfCommercialExp?: number;
  education?: string;
  workExperience?: string;
  courses?: string;
}
