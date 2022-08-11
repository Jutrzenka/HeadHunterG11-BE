import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import configuration from './Utils/config/configuration';
import * as cookieParser from 'cookie-parser';
import { whitelistCors } from './Utils/config/corsConfig';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
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
