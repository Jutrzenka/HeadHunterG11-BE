import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import { mailerConfig } from '../Utils/config/mailer-config';

@Module({
  imports: [MailerModule.forRootAsync(mailerConfig)],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
