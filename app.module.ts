import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TrackModule } from './track/track.module';

@Module({
  imports: [TrackModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
