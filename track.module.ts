import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { DatabaseModule } from 'src/database/database.module';
import { RedisCacheModule } from 'src/redis/redis.module';
import { UserAgentService } from 'src/shared/user-agent/user-agent.service';
import { GrpcService } from '../../src/shared/grpc/grpc.service';

@Module({
  imports: [DatabaseModule, RedisCacheModule],
  providers: [TrackService, UserAgentService, GrpcService],
  controllers: [TrackController],
})
export class TrackModule {}
