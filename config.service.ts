import { Injectable } from '@nestjs/common';
import { SequelizeOptions } from 'sequelize-typescript';
import { DbConfig } from './db';

@Injectable()
export class ConfigService {
    get sequelizeMasterConfig(): SequelizeOptions {
        return DbConfig.masterdb;
    }

    get sequelizeSlaveConfig(): SequelizeOptions {
        return DbConfig.slavedb;
    }

    get sequelizeDefaultConfig(): SequelizeOptions {
        return DbConfig.default;
    }
}
