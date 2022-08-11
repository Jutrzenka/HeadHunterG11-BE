import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import configuration from './Utils/config/configuration';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  await app.listen(
    configuration().server.port,
    configuration().server.domain,
    () => {
      console.log('Twoje zmienne .ENV');
      console.log(configuration());
    },
  );
}
(async () => {
  await bootstrap();
})();
