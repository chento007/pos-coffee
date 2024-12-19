import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { join } from 'path';

export async function typeormConfig(configService: ConfigService): Promise<TypeOrmModuleAsyncOptions> {
  const env = configService.get<string>('APP_ENV');
  if (env === 'dev') {
    return {
      type: configService.get<string>('DB_TYPE'),
      host: configService.get<string>('DB_HOST'),
      port: configService.get<string>('DB_PORT'),
      username: configService.get<string>('DB_USERNAME'),
      password: configService.get<string>('DB_PASSWORD'),
      database: configService.get<string>('DB_DATABASE'),
      maxQueryExecutionTime: 3000,
      synchronize: true,
      migrationsRun: false,
      dropSchema: false,
      logging: true,
      logger: 'advanced-console',
      entities: [join(__dirname, './../**/**.entity{.ts,.js}')],
    } as TypeOrmModuleAsyncOptions;
  }
}
