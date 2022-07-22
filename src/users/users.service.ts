import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/interfaces/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async newUser(): Promise<User> {
    const newUser = await this.userModel.create({
      idUser: 'jakis numer',
      role: 'A',
      email: 'e@mai.l',
      password: '111111',
      accessToken: 'token',
      registerCode: 'registrationCode',
    });
    return newUser.save();
  }

  findAll() {
    return `This action returns all users`;
  }
}
