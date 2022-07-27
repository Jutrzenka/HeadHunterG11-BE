export enum UserRole {
  'Admin' = 'A',
  'Student' = 'S',
  'HeadHunter' = 'H',
}

export interface AuthUser {
  idUser: string;
  role: UserRole;
  email: string;
  password: string;
  accessToken: string;
  registerCode: string;
}

export type CreateUserResponse = AuthUser;
