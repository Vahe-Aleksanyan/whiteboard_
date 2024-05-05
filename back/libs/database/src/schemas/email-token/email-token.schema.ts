import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseSchema } from '../base.schema';

export type EmailTokenDocument = EmailToken & Document;

@Schema({ timestamps: true, toJSON: { virtuals: true }, id: true })
export class EmailToken extends BaseSchema {
  @Prop({ trim: true, required: true, lowercase: true })
  email: string;

  @Prop({ trim: true, required: true })
  newToken: string;
}

export const EmailTokenSchema = SchemaFactory.createForClass(EmailToken);
