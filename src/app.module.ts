import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://AlexWilk:alamakota@headhuntercluster.cvbkb.mongodb.net/?retryWrites=true&w=majority',
      {
        connectionName: 'headhuntercluster',
      },
    ),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
