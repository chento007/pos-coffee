import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { join } from 'path';

export async function typeormConfig(configService: ConfigService) {
  const env = configService.get<string>('APP_ENV');
  if (env === 'dev') {
    return {
      type: 'sqlite',
      database: 'data/offline.db',
      synchronize: true,
      migrationsRun: false,
      dropSchema: false,
      entities: [join(__dirname, './../**/**.entity{.ts,.js}')],
    } as TypeOrmModuleAsyncOptions;
  }
}
