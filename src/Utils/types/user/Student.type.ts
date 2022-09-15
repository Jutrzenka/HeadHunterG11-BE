export enum Status {
  Inactive = 'Inactive',
  Active = 'Active',
  Employed = 'Employed',
}

export enum TypeWork {
  None = 'None',
  Office = 'Office',
  Relocation = 'Relocation',
  Remote = 'Remote',
  Hybrid = 'Hybrid',
}

export enum ContractType {
  None = 'None',
  UoP = 'UoP',
  B2B = 'B2B',
  UoD = 'UZ/UoD',
}

export interface FilterStudents {
  minSalary?: number;
  maxSalary?: number;
  expectedTypeWork?: TypeWork;
  expectedContractType?: ContractType;
  canTakeApprenticeship?: boolean;
  monthsOfCommercialExp?: number;
  courseCompletion?: number;
  courseEngagement?: number;
  projectDegree?: number;
  teamProjectDegree?: number;
}
