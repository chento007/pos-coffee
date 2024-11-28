import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TelegramService } from './telegram.service';
import { TelegrafModule } from 'nestjs-telegraf';


@Module({
  imports: [
    TelegrafModule.forRoot({
      token: '7789482492:AAEyuyVUe3CmNrOF7SPHKyDrXC1TkBCU8mo',  // Replace with your actual token
    }),
  ],
  providers: [
    TelegramService,
  ],
  exports: [TelegramService],
})
export class TelegramModule {

}
