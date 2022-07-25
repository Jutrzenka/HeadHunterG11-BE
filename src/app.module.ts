import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import configuration from './Utils/config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDataModule } from './userData/userData.module';
import { InterviewModule } from './interview/interview.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
    // src/config/configuration.ts ENV
    ConfigModule.forRoot({
      load: [configuration],
    }),
    // SQL
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: configuration().databaseMaria.host,
      port: configuration().databaseMaria.port,
      username: configuration().databaseMaria.username,
      password: configuration().databaseMaria.password,
      database: configuration().databaseMaria.name,
      entities: ['dist/**/**.entity{.ts,.js}'],
      bigNumberStrings: false,
      logging: true,
      //synchronize: true,
    }),
    // Główny moduł pod SQL
    UserDataModule,
    // Tablica z rozmowami SQL
    InterviewModule,
    // MongoDB
    MongooseModule.forRoot(configuration().databaseMongo.host),
    // Dokument w MongoDB
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
