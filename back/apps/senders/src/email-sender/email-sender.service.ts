import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { EmailDto } from 'libs/micoservices-clients/senders/dto/senders.dto';

@Injectable()
export class EmailSenderService {
  constructor(private mailerService: MailerService) {}
  logger = new Logger(EmailSenderService.name);

  async send({ ...opts }: EmailDto) {
    try {
      const sendMailOptions: ISendMailOptions = {
        ...opts,
      };
      const info = await this.mailerService.sendMail(sendMailOptions);
      this.logger.log({ info });
    } catch (error) {
      console.log('sendEmailError: ', error);
    }
  }
}
