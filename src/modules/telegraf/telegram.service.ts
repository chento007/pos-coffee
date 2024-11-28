import { Injectable } from '@nestjs/common';
import { Help, Start, Update, On, Hears } from 'nestjs-telegraf';
import { Context, Markup } from 'telegraf';

@Update()
@Injectable()
export class TelegramService {

  async hearsHi(ctx: Context) {
    try {
      await ctx.replyWithDocument({ source: 'D:\\pos\\nest-pos-coffee\\data\\offline.db' });
      await ctx.reply('Hey there');
    } catch (error) {
      console.error('Error sending document:', error);
      await ctx.reply('There was an error sending the document.');
    }
  }

  @Start()
  async onTextMessage(ctx: Context): Promise<void> {
    await ctx.replyWithHTML('<b>What would you like to know or track about your system?</b>', Markup.inlineKeyboard(
      [
        // First row with two buttons and emojis
        [Markup.button.callback('📅 Report of Today', 'today_report'), Markup.button.callback('📊 Sales Report', 'sales_report')],

        // Second row with two buttons and emojis
        [Markup.button.callback('📅 Report of This Week', 'week_report'), Markup.button.callback('📦 Inventory Status', 'inventory_status')],

        // Third row with two buttons and emojis
        [Markup.button.callback('📅 Report of This Month', 'month_report'), Markup.button.callback('👥 User Activity', 'user_activity')],

        // Fourth row with one button and emoji
        [Markup.button.callback('⚙️ System Health', 'system_health')]
      ]
    ));
  }

}
