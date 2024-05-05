import { getConnectionToken } from '@nestjs/mongoose';
import { mongoosepaginatev2 } from 'libs/utils/plugins';
import { Connection } from 'mongoose';
import { User, UserSchema } from './user.schema';

export const UsersProvider = {
  provide: User.name,
  useFactory: (connection: Connection) => {
    const schema = UserSchema;
    schema.plugin(mongoosepaginatev2);
    return connection.model(User.name, schema);
  },
  inject: [getConnectionToken()],
};
