import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import configuration from './Utils/config/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
