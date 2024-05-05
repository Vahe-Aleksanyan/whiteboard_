import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { EmailSenderService } from './email-sender.service';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
          user: 'yvnshell2024@gmail.com',
          pass: 'ishljigfrlieppbf',
          // pass: 'wadtvmroczipunid',
        },
      },
      defaults: {
        from: 'yvnshell2024@gmail.com',
      },
    }),
  ],
  providers: [EmailSenderService],
  exports: [EmailSenderService],
})
export class EmailSenderModule {}
