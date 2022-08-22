import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientGrpc } from '@nestjs/microservices';
import {
  merchGrpcClientOptions,
  recoGrpcClientOptions,
  utilsDeeplinkGrpcClientOptions,
  utilsGrpcClientOptions,
} from '../../grpc.options';
import { Metadata } from '@grpc/grpc-js';
import { MerchGrpcService } from './interfaces/merch-grpc-service.interface';
import { RecoGrpcService } from './interfaces/reco-grpc-service.interface';
import { UtilsGrpcService } from './interfaces/utils-grpc-service.interface';
import { GrpcResponse } from './interfaces/grpc-response.interface';
import { firstValueFrom } from 'rxjs';
import logger from 'src/logger';

@Injectable()
export class GrpcService implements OnModuleInit {
  @Client(recoGrpcClientOptions) private readonly recoClient: ClientGrpc;
  @Client(merchGrpcClientOptions) private readonly merchClient: ClientGrpc;
  @Client(utilsGrpcClientOptions) private readonly utilsClient: ClientGrpc;
  @Client(utilsDeeplinkGrpcClientOptions)
  private readonly deeplinkClient: ClientGrpc;

  recoGrpcService: RecoGrpcService;
  merchGrpcService: MerchGrpcService;
  utilsGrpcService: UtilsGrpcService;
  utilsDeeplinkGrpcService: UtilsGrpcService;

  onModuleInit() {
    this.setMerchGrpcService();
    this.setRecoGrpcService();
    this.setUtilsGrpcService();
    this.setUtilsDeeplinkGrpcService();
  }

  setUtilsDeeplinkGrpcService() {
    this.utilsDeeplinkGrpcService =
      this.deeplinkClient.getService<UtilsGrpcService>('UtilsGrpcService');
  }

  setRecoGrpcService() {
    this.recoGrpcService =
      this.recoClient.getService<RecoGrpcService>('RecoGrpcService');
  }

  setMerchGrpcService() {
    this.merchGrpcService =
      this.merchClient.getService<MerchGrpcService>('MerchGrpcService');
  }

  setUtilsGrpcService() {
    this.utilsGrpcService =
      this.utilsClient.getService<UtilsGrpcService>('UtilsGrpcService');
  }

  async product(data, headers?, cookies?) {
    // logger.info('gRPC product');
    try {
      const result = await firstValueFrom(
        this.recoGrpcService.product(
          { query: data, headers: headers, cookies: cookies },
          new Metadata({ cacheableRequest: true, waitForReady: true }),
          { deadline: Date.now() + +process.env.RECO_GRPC_TIMEOUT },
        ),
      );
      return JSON.parse(result.data);
    } catch (error) {
      // logger.error(error);
      return { data: error, status: 'Error' };
    }
  }

  async getByIdsNew(data, returnType = 'json') {
    // logger.info('gRPC getByIdsNew');
    try {
      const result = await firstValueFrom(
        this.merchGrpcService.getByIdsNew(
          { query: data },
          new Metadata({ cacheableRequest: true, waitForReady: true }),
          { deadline: Date.now() + +process.env.MERCH_GRPC_TIMEOUT },
        ),
      );
      return JSON.parse(result.data);
    } catch (error) {
      // logger.error(error);
      return { data: error, status: 'Error' };
    }
  }

  async getItemsFromIds(data, returnType = 'json') {
    // logger.info('gRPC getItemsFromIds');
    try {
      const result = await firstValueFrom(
        this.recoGrpcService.getItemsFromIds(
          { query: data },
          new Metadata({ cacheableRequest: true, waitForReady: true }),
          { deadline: Date.now() + +process.env.RECO_GRPC_TIMEOUT },
        ),
      );
      return JSON.parse(result.data);
    } catch (error) {
      // logger.error(error);
      return { data: error, status: 'Error' };
    }
  }

  async deeplink(data, returnType = 'json') {
    // logger.info('gRPC deeplink');
    try {
      const result = await firstValueFrom(
        this.utilsDeeplinkGrpcService.deeplink(
          { request: data },
          new Metadata({ cacheableRequest: true, waitForReady: true }),
          { deadline: Date.now() + +process.env.UTILS_GRPC_TIMEOUT },
        ),
      );
      return JSON.parse(result.response);
    } catch (error) {
      // logger.error(error);
      return { data: error, status: 'Error' };
    }
  }

  async banner(data, returnType = 'json') {
    // logger.info('gRPC banner');
    try {
      const result = await firstValueFrom(
        this.utilsDeeplinkGrpcService.banner(
          { request: data },
          new Metadata({ cacheableRequest: true, waitForReady: true }),
          { deadline: Date.now() + +process.env.UTILS_GRPC_TIMEOUT },
        ),
      );
      return JSON.parse(result.response);
    } catch (error) {
      // logger.error(error);
      return { data: error, status: 'Error' };
    }
  }

  async metaInfo(data, returnType = 'json') {
    // logger.info('gRPC metaInfo');
    try {
      const result = await firstValueFrom(
        this.utilsGrpcService.metaInfo(
          { request: data },
          new Metadata({ cacheableRequest: true, waitForReady: true }),
          { deadline: Date.now() + +process.env.UTILS_GRPC_TIMEOUT },
        ),
      );
      return JSON.parse(result.response);
    } catch (error) {
      // logger.error(error);
      return { data: error, status: 'Error' };
    }
  }

  async deeplinks(data, returnType = 'json') {
    // logger.info('gRPC deeplinks');
    try {
      const result = await firstValueFrom(
        this.utilsDeeplinkGrpcService.deeplinks(
          { request: data },
          new Metadata({ cacheableRequest: true, waitForReady: true }),
          { deadline: Date.now() + +process.env.UTILS_GRPC_TIMEOUT },
        ),
      );
      return JSON.parse(result.response);
    } catch (error) {
      // logger.error(error);
      return { data: error, status: 'Error' };
    }
  }

  async deeplinksUrl(data, returnType = 'json') {
    // logger.info('gRPC deeplinksurl');
    try {
      const result = await firstValueFrom(
        this.utilsDeeplinkGrpcService.deeplinksUrl(
          { request: data },
          new Metadata({ cacheableRequest: true, waitForReady: true }),
          { deadline: Date.now() + +process.env.UTILS_GRPC_TIMEOUT },
        ),
      );
      return JSON.parse(result.response);
    } catch (error) {
      // logger.error(error);
      return { data: error, status: 'Error' };
    }
  }
}
