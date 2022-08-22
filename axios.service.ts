import { Http } from './http.abstract';
import got from 'got';
import { Injectable } from '@nestjs/common';
import * as _ from 'underscore';

@Injectable()
export class AxiosService extends Http {
    constructor() {
        super();
    }

    async get(url: string, params: object, headers: any) {
        try {
            if (_.size(params) > 0) {
                url += "?" + Object.keys(params)
                    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
                    .join('&');
            }
            const response = await got.get(url, { headers });
            return { status: 'success', data: response.body };
        } catch (error) {
            return { status: 'error', data: error };
        }
    }

    async post(url: string, data: any, headers: any) {
        try {
            const response = await got.post(url, { body: data, headers });
            return { status: 'success', data: response.body };
        } catch (error) {
            return { status: 'error', data: error };
        }
    }

    async put(url: string, data: any, headers: any) {
        try {
            const response = await got.put(url, { body: data, headers });
            return { status: 'success', data: response.body };
        } catch (error) {
            return { status: 'error', data: error };
        }
    }

    async delete(url: string, headers: any) {
        try {
            const response = await got.delete(url, { headers });
            return { status: 'success', data: response.body };
        } catch (error) {
            return { status: 'error', data: error };
        }
    }

    async patch(url: string, data: any, headers: any) {
        try {
            const response = await got.patch(url, { body: data, headers });
            return { status: 'success', data: response.body };
        } catch (error) {
            return { status: 'error', data: error };
        }
    }
}