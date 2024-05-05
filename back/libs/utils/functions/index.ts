import { HttpException } from '@nestjs/common';
import { DateTime } from 'luxon';

export function parsePhone(v): string | null {
  if (!v) {
    return null;
  }
  const phone: string = v.match(/\d+/g)?.join('');
  return phone;
}

export const SMS_TIMEOUT = 60;

export const checkSMSDate = (date) => {
  if (date) {
    let { seconds } = DateTime.fromJSDate(date).diffNow('seconds').toObject();

    seconds = Math.round(Math.abs(seconds ?? 0));
    if (seconds <= SMS_TIMEOUT) {
      throw new HttpException(
        {
          message: 'errors_auth_smstimeout',
          timeout: SMS_TIMEOUT - seconds,
        },
        200,
      );
    }
  }
};
