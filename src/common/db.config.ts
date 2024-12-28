import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';

export const config = {
  default: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5438,
    database: process.env.DB_DATABASE || 'postgres-3',
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    reset: process.env.POSTGRES_RESET || false,
  },
};

export const options: DataSourceOptions = {
  type: 'postgres',
  host: config.default.host,
  port: config.default.port,
  username: config.default.username,
  password: config.default.password,
  database: config.default.database,
  ssl: false,
  logging: ["query", "error", "schema"],
  migrationsRun: true,
  entities: [join(__dirname, './../**/**.entity{.ts,.js}')],
  migrations: [join(__dirname, './../../migrations/*{.ts,.js}')],  
};

const dataSource = new DataSource(options);
export default dataSource;
