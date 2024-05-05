import { Module } from '@nestjs/common';
import { EmailSenderModule } from './email-sender/email-sender.module';
import { SendersController } from './senders.controller';
// import { SmsSenderModule } from './sms-sender/sms-sender.module';

import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    EmailSenderModule,
    // SmsSenderModule,
  ],
  controllers: [SendersController],
})
export class SendersModule {}
