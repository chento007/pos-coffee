import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { join } from 'path';

export async function typeormConfig(
  configService: ConfigService,
): Promise<TypeOrmModuleAsyncOptions> {
  const env = configService.get<string>('APP_ENV');
  if (env === 'dev') {
    return {
      type: configService.get<string>('DB_TYPE'),
      url: configService.get<string>('POSTGRES_URL'),
      maxQueryExecutionTime: 3000,
      synchronize: true,
      migrationsRun: true,
      dropSchema: false,
      logging: false,
      logger: 'advanced-console',
      entities: [join(__dirname, './../**/**.entity{.ts,.js}')],
      migrations: [join(__dirname, './../../migrations/*{.ts,.js}')],
    } as TypeOrmModuleAsyncOptions;
  }
}
