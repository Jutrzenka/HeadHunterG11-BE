import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import configuration from '../Utils/config/configuration';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    MailerModule.forRoot({
      transport: {
        pool: true,
        maxConnections: 3,
        maxMessages: 165,
        service: configuration().mailer.service,
        host: configuration().mailer.host,
        port: configuration().mailer.port,
        secure: configuration().mailer.secure,
        auth: {
          user: configuration().mailer.user,
          pass: configuration().mailer.pass,
        },
      },
      defaults: {
        from: configuration().mailer.from,
      },
      template: {
        dir: join(__dirname, './templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: configuration().mailer.strict,
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
