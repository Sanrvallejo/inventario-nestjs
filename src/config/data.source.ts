import { DataSource, DataSourceOptions } from "typeorm";
import { ConfigService, ConfigModule } from '@nestjs/config';
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } from "src/constants/constants";


ConfigModule.forRoot({
    envFilePath: '.development.env',
});

const configService = new ConfigService();

export const DataSourceConfig: DataSourceOptions = {
    type: 'mysql',
    host: configService.get<string>(DB_HOST),
    port: parseInt(configService.get<string>(DB_PORT), 10),
    username: configService.get<string>(DB_USER),
    password: configService.get<string>(DB_PASSWORD),
    database: configService.get<string>(DB_NAME),
    entities: [__dirname + '/../**/**/*.entity{.ts,.js}'],
    synchronize: true,
};

export const AppDS = new DataSource(DataSourceConfig);