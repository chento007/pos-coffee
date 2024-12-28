import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';

export const config = {
  default: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5438,
    database: process.env.DB_DATABASE || 'postgres',
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
  migrationsRun: true,
  // Ensure entity path matches where your *.entity.ts files are after transpilation to JS in prod
  entities: [join(__dirname, '../../modules/**/*.entity{.ts,.js}')],
  // Migration files should also correctly reference your TypeScript source in development
  migrations: [join(__dirname, '../../migrations/*{.ts,.js}')],
};

const dataSource = new DataSource(options);
export default dataSource;
