import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import configuration from './Utils/config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserDataModule } from './userData/userData.module';
import { InterviewModule } from './interview/interview.module';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AdminModule } from './admin/admin.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    // src/config/configuration.ts ENV
    ConfigModule.forRoot({
      load: [configuration],
    }),
    // MongoDB
    MongooseModule.forRoot(configuration().databaseMongo.host),
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
      logging: false,
      synchronize: true,
    }),
    // Nasze moduły
    UserDataModule,
    InterviewModule,
    AuthModule,
    AdminModule,
    MailModule,
    // Serwowanie plików statycznych
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '/public/build'),
    }),
  ],
})
export class AppModule {}
