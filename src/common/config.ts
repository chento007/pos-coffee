import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { join } from 'path';

export async function typeormConfig(configService: ConfigService): Promise<TypeOrmModuleAsyncOptions> {
  const env = configService.get<string>('APP_ENV');
  if (env === 'dev') {
    return {
      type: configService.get<string>('DB_TYPE'),
      host: configService.get<string>('DB_HOST'), // Use the service name here
      port: configService.get<string>('DB_PORT'),
      username: configService.get<string>('DB_USERNAME'),
      password: configService.get<string>('DB_PASSWORD'),
      database: configService.get<string>('DB_DATABASE'),
      maxQueryExecutionTime: 1000,
      synchronize: false,
      migrationsRun: false,
      dropSchema: false,
      logging: true,
      entities: [join(__dirname, './../**/**.entity{.ts,.js}')],
    } as TypeOrmModuleAsyncOptions;
  }
  // Optionally, you can add more environments or a default configuration
}
