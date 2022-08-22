import { Module } from '@nestjs/common';
import { GrpcService } from '../../shared/grpc/grpc.service';
import { UtilsService } from './utils.service';

@Module({
  imports: [],
  providers: [UtilsService, GrpcService],
  exports: [UtilsService],
})
export class UtilsModule {}
