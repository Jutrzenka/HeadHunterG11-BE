import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import configuration from './Utils/config/configuration';
<<<<<<< HEAD
import * as cookieParser from 'cookie-parser';
import { whitelistCors } from './Utils/config/cors-config';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = (await NestFactory.create(AppModule)) as NestExpressApplication;
  app.useGlobalPipes(
    new ValidationPipe({
      //If set to true, validation errors will not be returned to the client.
      // disableErrorMessages: true,

      whitelist: true,
      forbidNonWhitelisted: true,

      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      skipMissingProperties: true,
    }),
  );
  app.use(cookieParser());
  app.use(helmet({ contentSecurityPolicy: false }));
  app.enableCors({
    origin: whitelistCors.address,
    methods: whitelistCors.methods,
    credentials: true,
    optionsSuccessStatus: 200,
  });
=======

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
>>>>>>> 277b2a5b3021cb90893d51030c632c4d46bd1950
  await app.listen(
    configuration().server.port,
    configuration().server.domain,
    () => {
<<<<<<< HEAD
      console.log('Your .ENV:');
      console.log(configuration());
      console.log('Your CORS whitelist:');
      console.log(whitelistCors.address);
      console.log(whitelistCors.methods);
=======
      console.log('Twoje zmienne .ENV');
      console.log(configuration());
>>>>>>> 277b2a5b3021cb90893d51030c632c4d46bd1950
    },
  );
}
(async () => {
  await bootstrap();
})();
