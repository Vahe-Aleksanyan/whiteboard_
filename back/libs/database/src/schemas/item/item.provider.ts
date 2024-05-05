import { getConnectionToken } from '@nestjs/mongoose';
import {
  mongooseaggregatepaginatev2,
  mongoosepaginatev2,
} from 'libs/utils/plugins';
import { Connection } from 'mongoose';

import { Item, ItemSchema } from './item.schema';

export const ItemProvider = {
  provide: Item.name,
  useFactory: (connection: Connection) => {
    const schema = ItemSchema;
    schema.plugin(mongooseaggregatepaginatev2);
    schema.plugin(mongoosepaginatev2);
    return connection.model(Item.name, schema);
  },
  inject: [getConnectionToken()],
};
