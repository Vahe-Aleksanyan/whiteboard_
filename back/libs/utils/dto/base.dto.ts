import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { ExposeId } from '../decorator/exposeid.decorator';

export class BaseDto {
  @ApiProperty()
  @Expose()
  createdAt: string;
  @ApiProperty()
  @Expose()
  updatedAt: string;

  @Expose()
  _id: string;

  @ExposeId('_id')
  id: string;
}
