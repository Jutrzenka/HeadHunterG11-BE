import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { User, UserDocument } from 'src/interfaces/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async newUser(): Promise<User> {
    const newUser = await this.userModel.create({
      idUser: uuidv4(),
      role: 'A',
      email: 'e@mai.l',
      password: '111111',
      accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
      registerCode: 'dadfaDA56adfad',
    });
    return newUser.save();
  }

  findAll() {
    return `This action returns all users`;
  }
}
