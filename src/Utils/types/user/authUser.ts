import { v4 as uuid } from 'uuid';

export enum UserRole {
  'Admin' = 'A',
  'Student' = 'S',
  'HeadHunter' = 'H',
}

export interface AuthUser {
  idUser: uuid;
  role: string;
  email: string;
  password: string;
  accessToken: string;
  registerCode: string;
}

export type CreateUserResponse = AuthUser;
