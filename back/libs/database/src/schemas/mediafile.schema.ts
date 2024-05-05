import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MScheme } from 'mongoose';

export type MediaFileDocument = MediaFile & Document;

@Schema({ _id: false })
export class MediaFile {
  @Prop({ type: MScheme.Types.ObjectId })
  id: string;
  @Prop()
  fieldname: string;
  @Prop()
  originalname: string;
  @Prop()
  encoding: string;
  @Prop()
  mimetype: string;

  @Prop()
  filename: string;
  @Prop()
  bucketName: string;
  @Prop()
  chunkSize: number;
  @Prop()
  size: number;
  @Prop()
  contentType: string;

  @Prop()
  uploadDate: Date;
}

export const MediaFileSchema = SchemaFactory.createForClass(MediaFile);
