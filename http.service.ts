import {
    HttpService,
    Injectable,
} from '@nestjs/common';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import _ from 'lodash';
import { Observable } from 'rxjs/internal/Observable';
import logger from 'src/logger';

@Injectable()
export class ApiService {
    constructor(private httpService: HttpService) {}

    ping(): Observable<AxiosResponse<any>> {
        return this.httpService.get('https://www.google.com');
    }
    async getFromApiV3(url){
        return this.httpService.get(url).toPromise().then(resp =>{
            // logger.info('here');
            // logger.info(resp);
            return resp.data;
        }).catch(error =>{
            // logger.info('here1');
            // logger.info(error);
            return error;
        });
    }
    getFromApiV2(url): Observable<AxiosResponse> {
        return this.httpService.get(url);
    }
    getFromApi(
        url,
        paramsObj?: any,
        headersObj?: any,
    ): Promise<AxiosResponse<any>> {
        let config: AxiosRequestConfig = {};
        if (!_.isEmpty(headersObj)) {
            // headers = Object.assign(headers, headersObj);
            config.headers = headersObj;
        }
        if (!_.isEmpty(paramsObj)) {
            config.params = paramsObj;
        }
        return this.httpService
            .get(url, config)
            .toPromise()
            .then(resp => resp.data)
            .catch(err => {
                this.handleErr(err);
            });
    }

    postToAPI(
        url: string,
        paramsObj?: any,
        headersObj?: any,
        postData?: any,
    ): Promise<AxiosResponse<any>> {
        let config: AxiosRequestConfig = {};
        if (!_.isEmpty(headersObj)) {
            // headers = Object.assign(headers, headersObj);
            config.headers = headersObj;
        }
        if (!_.isEmpty(paramsObj)) {
            config.params = paramsObj;
        }
        if (!_.isEmpty(postData)) {
            config.data = postData;
        }
        return this.httpService
            .post(url, config)
            .toPromise()
            .then(resp => resp.data)
            .catch(err => {
                this.handleErr(err);
            });
    }
    handleErr(err: any) {
        // // logger.info(err);
        throw err;
        // throw new HttpException(
        //     'Some Server Error Occured. Please try again later.',
        //     HttpStatus.INTERNAL_SERVER_ERROR,
        // );
    }
}
