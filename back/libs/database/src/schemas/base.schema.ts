import { Prop, Schema } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true, id: true })
export class BaseSchema {
  _id?: Types.ObjectId;

  @Prop({ default: false })
  isDeleted?: boolean;

  @Prop({ default: Date.now })
  createdAt?: Date;
}
