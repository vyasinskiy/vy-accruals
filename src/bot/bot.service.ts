import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class BotService {
  private readonly bot: TelegramBot | null;
  private readonly groupChatId: number;

  constructor(private configService: ConfigService) {
    const token = this.configService.get('TELEGRAM_API_TOKEN');
    this.bot = new TelegramBot(token, { polling: true });
    this.groupChatId = this.configService.get('TELEGRAM_GROUP_CHAT_ID');
    this.setup();
  }

  setup() {
    this.bot.on('message', this.handleMessage);
  }

  handleMessage = async (msg: TelegramBot.Message) => {
    const chatId = msg.chat.id;
    console.log(chatId);

    if (chatId !== this.groupChatId) {
      await this.bot.sendMessage(
        chatId,
        `Sorry, this bot is not supposed to handle private messages`,
      );
    }

    if (!msg.text.startsWith('/')) {
      return;
    }

    // TODO: handle commands here
  };

  sendInvoice = async (invoicePath: string, address: string) => {
    console.log(`Sending document for ${address}...`);
    await this.bot.sendMessage(
      this.groupChatId,
      `Новая коммуналочка для адреса: ${address}`,
    );
    await this.bot.sendDocument(this.groupChatId, invoicePath);
  };
}
