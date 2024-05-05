import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';

export type PasswordRecoveryTokenDocument = PasswordRecovery & Document;

@Schema({ timestamps: false, _id: false })
export class PasswordRecovery {
  @Prop()
  passwordRecovery: string;

  @Prop({
    expires: '1m',
  })
  passwordRecoveryExpiry: Date;
}

export const PasswordRecoverySchema =
  SchemaFactory.createForClass(PasswordRecovery);
