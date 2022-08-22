import { Metadata, CallOptions } from '@grpc/grpc-js';
import { Observable } from "rxjs";
import { GrpcResponse } from './grpc-response.interface';
import { GrpcRequest } from './grpc-request.interface';
export interface RecoGrpcService {
    product(data: GrpcRequest, metadata: Metadata, callOptions: CallOptions): Observable<GrpcResponse>;
    getItemsFromIds(data: GrpcRequest, metadata: Metadata, callOptions: CallOptions): Observable<GrpcResponse>;
}