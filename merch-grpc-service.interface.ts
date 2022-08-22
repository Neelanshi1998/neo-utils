import { Metadata, CallOptions } from '@grpc/grpc-js';
import { Observable } from "rxjs";
import { GrpcResponse } from './grpc-response.interface';
import { GrpcRequest } from './grpc-request.interface';
export interface MerchGrpcService {
    getByIdsNew(data: GrpcRequest, metadata: Metadata, callOptions: CallOptions): Observable<GrpcResponse>;
}