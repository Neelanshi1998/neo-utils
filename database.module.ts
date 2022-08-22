import { Module } from '@nestjs/common';
import { ConfigService } from 'src/config/config.service';
import { databaseProviders } from './database.providers';

@Module({
  providers: [...databaseProviders, ConfigService],

  exports: [...databaseProviders],
})
export class DatabaseModule {}
