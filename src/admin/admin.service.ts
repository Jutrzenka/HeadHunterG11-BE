import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/auth/schema/user.schema';
// import { v4 as uuid } from 'uuid';
// import { UserRole } from '../Utils/types/user/AuthUser.type';
// import { JwtAdminPayload } from './jwtAdmin.strategy';
// import configuration from '../Utils/config/configuration';
// import { sign } from 'crypto';
// import { Response } from 'express';
// import { encryption } from '../Utils/function/bcrypt';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>, // @InjectModel(Admin.name) // private adminModel: Model<AdminDocument>,
  ) {}

  // // Dodawanie użytkownika przez Kubę
  // async createUser({
  //   email,
  //   role,
  // }: {
  //   email: string;
  //   role: UserRole;
  // }): Promise<User> {
  //   const newUser = await this.userModel.create({
  //     idUser: uuid(),
  //     role,
  //     email,
  //     login: email.toUpperCase().split('@')[0].concat('-', uuid()),
  //     registerCode: uuid(),
  //   });
  //   return newUser.save();
  // }
  //
  // public createAdminToken(currentTokenId: string): {
  //   accessToken: string;
  //   expiresIn: number;
  // } {
  //   const payload: JwtAdminPayload = { id: currentTokenId };
  //   const expiresIn = 60 * 60 * 24;
  //   const accessToken = sign(payload, configuration().server.secretKey, {
  //     expiresIn,
  //   });
  //   return {
  //     accessToken,
  //     expiresIn,
  //   };
  // }
  //
  // public async generateAdminToken(user: User, admin: Admin): Promise<string> {
  //   let token;
  //   let userWithThisToken = null;
  //   do {
  //     token = uuid();
  //     userWithThisToken = await this.userModel.findOne({
  //       accessToken: token,
  //     });
  //   } while (!!userWithThisToken);
  //   admin.accessToken = token;
  //   await admin.save();
  //   return token;
  // }
  //
  // async login(req: { email: string; pwd: string }, res: Response) {
  //   try {
  //     const hashPassword = await encryption(req.pwd);
  //     if (!hashPassword.status) {
  //       throw new Error(hashPassword.error);
  //     }
  //     const admin = await this.adminModel.findOne({
  //       email: req.email,
  //       hashPassword,
  //     });
  //     if (!admin) {
  //       // return res.json({ error: 'Invalid login data!' });
  //       return {
  //         success: false,
  //         typeData: 'status',
  //         data: { code: 404, message: 'Not found this User' },
  //       };
  //     }
  //
  //     const token = this.createAdminToken(
  //       await this.generateAdminToken(user, admin),
  //     );
  //
  //     return res
  //       .cookie('jwt', token.accessToken, {
  //         secure: false,
  //         domain: configuration().server.domain,
  //         httpOnly: true,
  //       })
  //       .json({
  //         success: true,
  //         typeData: 'status',
  //         data: null,
  //       });
  //   } catch (e) {
  //     return {
  //       success: false,
  //       typeData: 'status',
  //       data: { code: 404, message: e.message },
  //     };
  //   }
  // }

  async logout() {
    return 'logout';
  }
}
