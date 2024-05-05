import * as mongoosepaginatev2 from 'mongoose-paginate-v2';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as mongooseaggregatepaginatev2 from 'mongoose-aggregate-paginate-v2';

import * as mongoosesequence from 'mongoose-sequence';

mongoosepaginatev2.paginate.options = {
  limit: 10,
  lean: true,
};

export { mongoosepaginatev2, mongoosesequence, mongooseaggregatepaginatev2 };
