import { ApiProperty } from '@nestjs/swagger';
import { ParseEmail } from 'libs/utils/decorator/parse-email.decorator';

export class SendEmailDto {
  @ApiProperty()
  @ParseEmail()
  email: string;
}
