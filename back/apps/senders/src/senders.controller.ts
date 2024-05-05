import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { EmailSenderService } from './email-sender/email-sender.service';

// import { SmsSenderService } from './sms-sender/sms-sender.service';

import { EmailDto } from 'libs/micoservices-clients/senders/dto/senders.dto';
import { SendersEventsEnum } from './senders.events.enum';

@Controller()
export class SendersController {
  constructor(private emailSenderService: EmailSenderService) {}

  logger = new Logger(SendersController.name);

  @EventPattern(SendersEventsEnum.send_email)
  sendEmail(@Payload() data: EmailDto) {
    this.logger.log(`send_email:`, data);
    return this.emailSenderService.send(data);
  }
}
