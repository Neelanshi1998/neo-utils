import { Inject, Injectable } from '@nestjs/common';
import { GrpcService } from '../../shared/grpc/grpc.service';
import { ApiService } from '../../shared/http/http.service';
import * as _ from 'underscore';
import { Http } from '../../shared/http/http.abstract';

const UTILS_API_BASE =
  process.env.UTILS_URL || 'https://sandbox.purplle.com/neo/utils';

type UtilsResponseType = {
  status: 'success' | 'failure';
  data: any;
};

@Injectable()
export class UtilsService {
  httpService: any;
  constructor(
    private readonly apiService: ApiService,
    private grpcService: GrpcService,
  ) {}

  async callMetaInfo(p: {
    module: string;
    moduleId: string;
    page: string;
    isNewMetadata?: boolean;
    //addlParams?: string;
    itemsCount?: number;
    pageType?: string;
    listSlug?: string;
    deleteCache?: boolean;
    cache?: string;
    sort_by?: string;
    metaFlag?: number;
    custom?: string;
  }): Promise<Record<string, any>> {
    const queryString = this.buildQuery(p);

    const callUrl = `${UTILS_API_BASE}/meta-info?${queryString}`;
    let response;
    if (process.env.CALL_UTILS_USING == 'GRPC') {
      // logger.info(p);
      response = await this.getUsingGrpc('metaInfo', p);
    } else {
      response = await this.get(callUrl);
    }
    if (response && response.status === 'success') {
      return response.data ? response.data : response;
    }

    return {};
  }

  async callBannerDeepLink(p: {
    url: string;
    buildNumber?: number;
    modeDevice?: 'android' | 'androidapp' | 'iosapp' | 'ios';
  }): Promise<string> {
    const queryString = this.buildQuery({
      lpurl: p.url,
      buildNumber: p.buildNumber,
      modeDevice: p.modeDevice,
    });

    const callUrl = `${UTILS_API_BASE}/banner?${queryString}`;
    let response;
    if (process.env.CALL_UTILS_USING == 'GRPC') {
      response = await this.getUsingGrpc('banner', {
        lpurl: p.url,
        buildNumber: p.buildNumber,
        modeDevice: p.modeDevice,
      });
    } else {
      response = await this.get(callUrl);
    }
    if (response && response.status === 'success') {
      return response.data ? response.data : '';
    }

    return '';
  }

  async callDeepLink(p: {
    url: string;
    buildNumber?: number;
    modeDevice?: 'android' | 'androidapp' | 'iosapp' | 'ios';
  }) {
    const queryString = this.buildQuery(p);

    const callUrl = `${UTILS_API_BASE}/deeplink?${queryString}`;
    let response;
    if (process.env.CALL_UTILS_USING == 'GRPC') {
      response = await this.getUsingGrpc('deeplink', p);
    } else {
      response = await this.get(callUrl);
    }
    if (response && response.status === 'success') {
      return response.data ? response.data : '';
    }

    return '';
  }

  async callMultipleDeepLink(p: {
    urls: string[];
    buildNumber?: number;
    modeDevice?: 'android' | 'androidapp' | 'iosapp' | 'ios';
  }) {
    let urls = p.urls.map((ele) => encodeURIComponent(ele)).join('[SEP]');
    const queryString = Object.keys(p)
      .map((k) => k + '=' + p[k])
      .join('&');

    const callUrl = `${UTILS_API_BASE}/deeplinks?${queryString}`;

    let response;
    if (process.env.CALL_UTILS_USING == 'GRPC') {
      urls = p.urls.map((ele) => ele).join('[SEP]');
      response = await this.getUsingGrpc('deeplinks', { ...p, urls });
    } else {
      response = await this.get(callUrl);
    }
    if (response && response.status === 'success') {
      return response.data ? response.data : '';
    }

    return '';
  }

  async deeplinksUrl(p: {
    urls: string[];
    buildNumber?: number;
    modeDevice?: 'android' | 'androidapp' | 'iosapp' | 'ios';
  }) {
    let urls = p.urls.map((ele) => encodeURIComponent(ele)).join('[SEP]');
    const queryString = Object.keys(p)
      .map((k) => k + '=' + p[k])
      .join('&');

    const callUrl = `${UTILS_API_BASE}/deeplinksUrl?${queryString}`;

    let response;
    if (process.env.CALL_UTILS_USING == 'GRPC') {
      urls = p.urls.map((ele) => ele).join('[SEP]');
      response = await this.getUsingGrpc('deeplinksUrl', { ...p, urls });
    } else {
      response = await this.get(callUrl);
    }
    if (response && response.status === 'success') {
      return response.data ? response.data : '';
    }

    return '';
  }

  buildQuery(p: Record<string, string | number | boolean>) {
    const e = encodeURIComponent;
    return Object.keys(p)
      .map((k) => e(k) + '=' + e(p[k]))
      .join('&');
  }

  async getUsingGrpc(rpc, dataObject: any) {
    try {
      const response: any = await this.grpcService[rpc](
        JSON.stringify(dataObject),
      );
      if (!_.isEmpty(response)) {
        return response;
      }

      return {
        status: 'failure',
        data: {},
      };
    } catch (error) {
      // logger.info(
      //     `GRPC: ${rpc} ${JSON.stringify(dataObject)} failed to get response: `,
      //     error?.response && error.response?.data,
      // );
      return {
        status: 'failure',
        data: {},
      };
    }
  }

  async get(url: string): Promise<UtilsResponseType> {
    try {
      const response = await this.httpService.get(url, {}, {});
      const { statusCode, data } = response;
      if (statusCode >= 200 && statusCode < 300) {
        return JSON.parse(data);
      }

      return {
        status: 'failure',
        data: {},
      };
    } catch (error) {
      // logger.info(
      //     `${url} failed to get response: `,
      //     error.response && error.response.data,
      // );
    }
  }
}
