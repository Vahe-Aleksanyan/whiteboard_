import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { BaseSchema } from '../base.schema';

export type ItemDocument = Item & Document;

@Schema({ timestamps: true, toJSON: { virtuals: true }, id: true })
export class Item extends BaseSchema {
  @Prop({ type: [{ type: Object }] })
  elements?: object[];
}

export const ItemSchema = SchemaFactory.createForClass(Item);
