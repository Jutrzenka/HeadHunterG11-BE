import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}
  async sendMail(to: string, tittle: string, message: string): Promise<any> {
    await this.mailerService.sendMail({
      to,
      subject: tittle,
      html: message,
    });
  }
}
