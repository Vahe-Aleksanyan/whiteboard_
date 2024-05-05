import { getConnectionToken } from '@nestjs/mongoose';
import { mongoosepaginatev2 } from 'libs/utils/plugins';
import { Connection } from 'mongoose';
import { EmailToken, EmailTokenSchema } from './email-token.schema';

export const EmailTokenProvider = {
  provide: EmailToken.name,
  useFactory: (connection: Connection) => {
    const schema = EmailTokenSchema;
    schema.plugin(mongoosepaginatev2);
    return connection.model(EmailToken.name, schema);
  },
  inject: [getConnectionToken()],
};
