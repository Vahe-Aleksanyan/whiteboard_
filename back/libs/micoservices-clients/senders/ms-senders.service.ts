import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MS_SENDERS } from 'libs/config';

import { EmailDto, SmsDto } from './dto/senders.dto';
import { SendersEventsEnum } from 'apps/senders/src/senders.events.enum';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class MSSendersService {
  logger = new Logger(MSSendersService.name);
  constructor(
    @Inject(MS_SENDERS)
    private sendersService: ClientProxy,
  ) {}

  async sendSms(data: SmsDto) {
    try {
      return await lastValueFrom(
        this.sendersService.emit(SendersEventsEnum.send_sms, data),
      );
    } catch (error) {
      this.logger.error(error);
    }
  }

  async sendEmail(data: EmailDto) {
    try {
      return await lastValueFrom(
        this.sendersService.emit(SendersEventsEnum.send_email, data),
      );
    } catch (error) {
      this.logger.error(error);
    }
  }
}
