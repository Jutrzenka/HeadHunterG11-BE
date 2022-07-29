import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/Utils/schema/user.schema';
import { v4 as uuid } from 'uuid';
import { UserRole } from '../Utils/types/user/AuthUser.type';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  // Dodawanie użytkownika przez Kubę
  async createUser({
    email,
    role,
  }: {
    email: string;
    role: UserRole;
  }): Promise<User> {
    const newUser = await this.userModel.create({
      idUser: uuid(),
      role,
      email,
      login: email.toUpperCase().split('@')[0].concat('-', uuid()),
      registerCode: uuid(),
    });
    return newUser.save();
  }

  async login() {
    return 'login';
  }

  async logout() {
    return 'logout';
  }
}
