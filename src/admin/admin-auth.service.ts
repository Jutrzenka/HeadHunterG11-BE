import { Model } from 'mongoose';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Admin, AdminDocument } from './schema/admin.schema';
import {
  generateErrorResponse,
  generateSuccessResponse,
} from '../Utils/function/generateJsonResponse/generateJsonResponse';
import { Response } from 'express';
import { decryption } from '../Utils/function/bcrypt';
import configuration from '../Utils/config/configuration';
import { User } from '../auth/schema/user.schema';
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
      const isAdmin = await decryption(req.pwd, admin.password);
      if (!isAdmin) {
        return res.json(generateErrorResponse('D000'));
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
          httpOnly: true,
        })
        .json(generateSuccessResponse());
    } catch (e) {
      return res.json(generateErrorResponse('D000'));
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
    } catch (e) {
      return res.json(generateErrorResponse('A000'));
    }
  }
}
