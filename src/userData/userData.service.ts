import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserDataService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async firstLogin({
    idUser,
    firstName,
    lastName,
  }: {
    idUser: string;
    firstName: string;
    lastName: string;
  }) {
    return this.usersRepository.create({ idUser, firstName, lastName }).save();
  }
}
