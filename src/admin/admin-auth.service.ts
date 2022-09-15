import { Model } from 'mongoose';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Admin, AdminDocument } from './schema/admin.schema';
import {
  generateElementResponse,
  generateErrorResponse,
  generateSuccessResponse,
  RestStandardError,
} from '../Utils/function/generateJsonResponse/generateJsonResponse';
import { Response } from 'express';
import { decryption } from '../Utils/function/bcrypt';
import configuration from '../Utils/config/configuration';
import { AdminTokenService } from './authorization-token/admin-token.service';
import { AdminAuthLoginDto } from './dto/admin-auth-login.dto';

@Injectable()
export class AdminAuthService {
  constructor(
    @InjectModel(Admin.name)
    private adminModel: Model<AdminDocument>,
    @Inject(forwardRef(() => AdminTokenService))
    private adminTokenService: AdminTokenService,
  ) {}

  async adminLogin(req: AdminAuthLoginDto, res: Response): Promise<Response> {
    try {
      const admin = await this.adminModel.findOne({
        login: req.login,
      });
      if (!admin) {
        throw new RestStandardError('Błędny login', 400);
      }

      const isAdmin = await decryption(req.pwd, admin.password);
      if (!isAdmin) {
        throw new RestStandardError('Błędne hasło', 400);
      }

      const token = this.adminTokenService.createAdminToken(
        await this.adminTokenService.generateAdminToken(admin),
        admin.idAdmin,
        admin.login,
      );

      return res
        .cookie('jwtAdmin', token.accessToken, {
          secure: configuration().server.ssl,
          domain: configuration().server.domain,
          sameSite: 'none',
          httpOnly: true,
        })
        .json(
          generateElementResponse('object', {
            id: admin.idAdmin,
            login: admin.login,
            role: 'ADMIN',
          }),
        );
    } catch (err) {
      return res.json(generateErrorResponse(err, err.message, err.status));
    }
  }

  async adminLogout(admin: Admin, res: Response): Promise<Response> {
    try {
      await this.adminModel.findOneAndUpdate(
        { idAdmin: admin.idAdmin },
        { accessToken: null },
      );
      res.clearCookie('jwtAdmin', {
        secure: configuration().server.ssl,
        domain: configuration().server.domain,
        httpOnly: true,
      });
      return res.json(generateSuccessResponse());
    } catch (err) {
      return res.json(generateErrorResponse(err, err.message, err.status));
    }
  }
}
