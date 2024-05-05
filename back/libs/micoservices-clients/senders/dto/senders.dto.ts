export class SmsDto {
  phones: string[];
  message: string;
}
export class EmailDto {
  to: string;
  subject: string;
  template?: string;
  context?: object;
  text?: string;
  html?: string;
  attachments?: string[];
}
