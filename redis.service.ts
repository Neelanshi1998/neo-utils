import { Cache } from 'cache-manager';
import { isEmpty } from 'underscore';
import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisCacheService {
  private readonly clusterClient: Redis.Cluster;
  private readonly persistentProduct: Redis.Cluster;
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {
    if (isEmpty(this.clusterClient)) {
      this.clusterClient = new Redis.Cluster(
        JSON.parse(
          '[{"host":"10.140.0.39","port":7000,"password":"s@ndb@x"},{"host":"10.140.0.39","port":7001,"password":"s@ndb@x"},{"host":"10.140.0.39","port":7002,"password":"s@ndb@x"},{"host":"10.140.0.39","port":7003,"password":"s@ndb@x"},{"host":"10.140.0.39","port":7004,"password":"s@ndb@x"},{"host":"10.140.0.39","port":7005,"password":"s@ndb@x"}]',
        ),
      );
    }
    if (isEmpty(this.persistentProduct)) {
      this.persistentProduct = new Redis.Cluster(
        JSON.parse(
          '[{"host":"10.160.0.184","port":8000,"password":"DdV4X2sgf5a"},{"host":"10.160.15.205","port":8000,"password":"DdV4X2sgf5a"},{"host":"10.160.15.206","port":8000,"password":"DdV4X2sgf5a"},{"host":"10.160.15.207","port":8000,"password":"DdV4X2sgf5a"},{"host":"10.160.15.208","port":8000,"password":"DdV4X2sgf5a"},{"host":"10.160.15.209","port":8000,"password":"DdV4X2sgf5a"}]',
        ),
        {
          scaleReads: 'slave',
          redisOptions: {
            password: 'DdV4X2sgf5a',
          },
        },
      );
    }
  }

  async get(key: string): Promise<any> {
    try {
      let response = await this.cache.get(key);
      // console.log("redis get key=" +key);
      // console.log(response);
      return response;
    } catch (error) {
      // console.log(error);
      return null;
    }
  }

  async delete(key: string): Promise<number> {
    const res: any = await this.cache.del(key);
    return res;
  }

  async set(key: string, value: any, ttl: number): Promise<boolean> {
    let res: any = await this.cache.set(key, value, { ttl: ttl });
    return true;
  }

  async hget(key: string, field: string): Promise<Object> {
    return await this.clusterClient.hget(key, field);
  }

  async hmget(
    key: string,
    ...fields: string[]
  ): Promise<Record<string, string | number> | null> {
    const values = await this.persistentProduct.hmget(key, ...fields);
    const result = {};
    let isObjectNull = true;
    for (let i = 0; i < fields.length; i++) {
      if (isObjectNull && values[i] !== null) {
        isObjectNull = false;
      }
      result[fields[i]] = values[i];
    }
    return isObjectNull ? null : result;
  }

  async hgetAll(key: string): Promise<Object> {
    return await this.clusterClient.hgetall(key);
  }

  async hscan(key: string): Promise<Object> {
    var cursor = 0,
      redisHSCANResponse;
    const result = {},
      data = [];
    do {
      redisHSCANResponse = await this.clusterClient.hscan(key, cursor);
      cursor = Number(redisHSCANResponse[0]);
      data.push(...redisHSCANResponse[1]);
    } while (cursor != 0);
    for (var i = 0; i < data.length; i += 2) {
      result[data[i]] = data[i + 1];
    }
    return result;
  }
}
