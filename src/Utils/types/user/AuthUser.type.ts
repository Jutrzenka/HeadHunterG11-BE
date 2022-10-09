export enum UserRole {
<<<<<<< HEAD
=======
  'Admin' = 'A',
>>>>>>> 277b2a5b3021cb90893d51030c632c4d46bd1950
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
