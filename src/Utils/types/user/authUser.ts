export interface AuthUser {
  idUser: string;
  role: string;
  email: string;
  password: string;
  accessToken: string;
  registerCode: string;
}

export type CreateUserResponse = AuthUser;
