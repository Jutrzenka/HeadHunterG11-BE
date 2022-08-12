import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { createTransport } from 'nodemailer';
import { join } from 'path';
import configuration from './configuration';

const transport = createTransport(
  {
    host: configuration().mailer.host,
    port: configuration().mailer.port,
    secure: configuration().mailer.secure,
    auth: {
      user: configuration().mailer.user,
      pass: configuration().mailer.pass,
    },
  },
  {
    from: configuration().mailer.from,
  },
);

export const mailerConfig = {
  useFactory: () => ({
    transport: 'smtp://admin:password@localhost:2500',
    template: {
      dir: join(__dirname, './templates'),
      adapter: new HandlebarsAdapter(),
      options: {
        strict: configuration().mailer.strict,
      },
    },
  }),
};
