import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';

export const config = {
  default: {
    url: process.env.POSTGRES_URL || "postgres://default:X8xHf5QpMDNh@ep-dry-smoke-a1h06qcu-pooler.ap-southeast-1.aws.neon.tech:5432/verceldb?sslmode=require",
    reset: process.env.POSTGRES_RESET || false,
  },
};

export const options: DataSourceOptions = {
  type: 'postgres',
  url: config.default.url,
  ssl: false,
  logging: ["query", "error", "schema"],
  migrationsRun: true,
  entities: [join(__dirname, './../**/**.entity{.ts,.js}')],
  migrations: [join(__dirname, './../../migrations/*{.ts,.js}')],  
};

const dataSource = new DataSource(options);
export default dataSource;
