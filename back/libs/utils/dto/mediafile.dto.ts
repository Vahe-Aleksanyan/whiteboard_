import { ApiProperty } from '@nestjs/swagger';

import { ExposeId } from '../decorator/exposeid.decorator';

export class MediaFileDto {
  @ExposeId()
  id: string;

  @ApiProperty()
  fieldname: string;
  @ApiProperty()
  originalname: string;
  @ApiProperty()
  encoding: string;
  @ApiProperty()
  mimetype: string;
  @ApiProperty()
  buffer: Buffer;
  @ApiProperty()
  size: number;

  @ApiProperty()
  filename: string;

  @ApiProperty()
  bucketName: string;
  @ApiProperty()
  chunkSize: number;
  @ApiProperty()
  contentType: string;
  @ApiProperty()
  uploadDate: Date;
}
