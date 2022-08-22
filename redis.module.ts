import { Module, CacheModule } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
// import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisCacheService } from './redis.service';

@Module({
    imports: [
        CacheModule.registerAsync({
            imports: [/* ConfigModule */],
            inject: [/* ConfigService */],
            useFactory: async (/* configService: ConfigService */) => ({
                store: redisStore,
                host: process.env.REDIS_HOST,
                port: process.env.REDIS_PORT,
                // ttl: process.env.CACHE_TTL,
                // clusterConfig: {
                //     nodes: JSON.parse(process.env.REDIS_CLUSTER),
                //     options: {
                //         maxRedirections: 16
                //     },
                // }
            }),
        }),
    ],
    providers: [RedisCacheService],
    exports: [RedisCacheService]
})
export class RedisCacheModule {}