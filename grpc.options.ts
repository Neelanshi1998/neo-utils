import { Transport, ClientOptions } from '@nestjs/microservices';
import { join } from 'path';

export const recoGrpcClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    url: process.env.GRPC_RECO_URL,
    package: 'reco',
    protoPath: join(__dirname, './modules/shared/grpc/reco-grpc.proto'),
    maxSendMessageLength: 20 * 1024 * 1024,
    maxReceiveMessageLength: 50 * 1024 * 1024,
    channelOptions: {"grpc.lb_policy_name": "round_robin"}
  },
};

export const merchGrpcClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    url: process.env.GRPC_MERCH_URL,
    package: 'merch',
    protoPath: join(__dirname, './modules/shared/grpc/merch-grpc.proto'),
    maxSendMessageLength: 20 * 1024 * 1024,
    maxReceiveMessageLength: 50 * 1024 * 1024,
    channelOptions: {"grpc.lb_policy_name": "round_robin"}
  },
};

export const utilsGrpcClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    url: process.env.GRPC_UTILS_URL,
    package: 'utils',
    protoPath: join(__dirname, './modules/shared/grpc/utils-grpc.proto'),
    maxSendMessageLength: 20 * 1024 * 1024,
    maxReceiveMessageLength: 50 * 1024 * 1024,
    channelOptions: {"grpc.lb_policy_name": "round_robin"}
  },
};

export const utilsDeeplinkGrpcClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    url: process.env.GRPC_UTILS_URL,
    package: 'utils',
    protoPath: join(__dirname, './modules/shared/grpc/utils-grpc.proto'),
    maxSendMessageLength: 20 * 1024 * 1024,
    maxReceiveMessageLength: 50 * 1024 * 1024,
    channelOptions: {"grpc.lb_policy_name": "round_robin"}
  },
};
