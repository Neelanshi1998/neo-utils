import { Sequelize } from 'sequelize-typescript';
import { ConfigService } from '../config/config.service';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async (configService: ConfigService) => {
      const sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASSWORD,
        configService.sequelizeDefaultConfig,
      );
      sequelize.addModels([]);
      // await sequelize.sync();
      return sequelize;
    },
    inject: [ConfigService],
  },
  {
    provide: 'SEQUELIZE_MASTER',
    useFactory: async (configService: ConfigService) => {
      const sequelize = new Sequelize(configService.sequelizeMasterConfig);
      sequelize.addModels([]);
      // await sequelize.sync();
      return sequelize;
    },
    inject: [ConfigService],
  },
  {
    provide: 'SEQUELIZE_SLAVE',
    useFactory: async (configService: ConfigService) => {
      const sequelize = new Sequelize(configService.sequelizeSlaveConfig);
      sequelize.addModels([]);
      // await sequelize.sync();
      return sequelize;
    },
    inject: [ConfigService],
  },
];
