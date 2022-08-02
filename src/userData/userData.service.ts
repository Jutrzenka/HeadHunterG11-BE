import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { User } from './entities/user.entity';

@Injectable()
export class UserDataService {
  constructor(
    @Inject(forwardRef(() => AuthService)) private authService: AuthService,
  ) {}

  async activateMariaAccount({
    idUser,
    firstName,
    lastName,
  }: {
    idUser: string;
    firstName: string;
    lastName: string;
  }): Promise<User> {
    // if ((await this.getAllUsers()).some(user => user.email === newUser.email)) {
    //   throw new Error("This email is already in use");
    // }
    try {
      const user = new User();
      user.idUser = idUser;
      user.firstName = firstName;
      user.lastName = lastName;
      await user.save();

      return user;
    } catch (err) {
      throw err;
    }
  }
}
