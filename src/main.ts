import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import configuration from './Utils/config/configuration';
import * as cookieParser from 'cookie-parser';
import { whitelistCors } from './Utils/config/cors-config';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';

async function bootstrap() {
  const app = (await NestFactory.create(AppModule)) as NestExpressApplication;
  app.use(cookieParser());
  app.use(helmet());
  app.enableCors({
    origin: whitelistCors.address,
    methods: whitelistCors.methods,
    credentials: true,
    optionsSuccessStatus: 200,
  });
  await app.listen(
    configuration().server.port,
    configuration().server.domain,
    () => {
      console.log('Your .ENV:');
      console.log(configuration());
      console.log('Your CORS whitelist:');
      console.log(whitelistCors.address);
      console.log(whitelistCors.methods);
    },
  );
}
(async () => {
  await bootstrap();
})();
