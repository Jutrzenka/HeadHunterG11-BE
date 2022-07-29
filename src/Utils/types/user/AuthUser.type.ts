export enum UserRole {
  'Student' = 'S',
  'HeadHunter' = 'H',
}

export interface AuthUserType {
  idUser: string;
  role: UserRole;
  email: string;
  password: string;
  accessToken: string;
  registerCode: string;
}

export type CreateUserResponse = AuthUserType;
