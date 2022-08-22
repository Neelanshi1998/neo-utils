import { Metadata, CallOptions } from '@grpc/grpc-js';
import { Observable } from "rxjs";
export interface UtilsGrpcService {
    deeplink(data: { request: string }, metadata: Metadata, callOptions: CallOptions): Observable<{ response: string }>;
    banner(data: { request: string }, metadata: Metadata, callOptions: CallOptions): Observable<{ response: string }>;
    metaInfo(data: { request: string }, metadata: Metadata, callOptions: CallOptions): Observable<{response: string}>;
    deeplinks(data: { request: string }, metadata: Metadata, callOptions: CallOptions): Observable<{ response: string }>;
    deeplinksUrl(data: { request: string }, metadata: Metadata, callOptions: CallOptions): Observable<{ response: string }>;
}