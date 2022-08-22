
export abstract class Http {

    abstract get(url: string, params?: object, headers?: any, cookies?: Record<string, string>): Promise<any>;
        
    abstract post(url: string, data: any, headers?: any): Promise<any>;

    abstract put(url: string, data: any, headers?: any): Promise<any>;

    abstract patch(url: string, data: any, headers?: any): Promise<any>;

    abstract delete(url: string, headers?: any): Promise<any>;

}