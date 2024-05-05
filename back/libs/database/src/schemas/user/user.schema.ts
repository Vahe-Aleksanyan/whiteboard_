import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { UserRoleEnum } from './users.roles.enum';
import { BaseSchema } from '../base.schema';
import { parsePhone } from 'libs/utils/functions';
import { MediaFile, MediaFileSchema } from '../mediafile.schema';

export type UserDocument = User & Document;

const capitalize = (s) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

@Schema({ timestamps: true, toJSON: { virtuals: true }, id: true })
export class User extends BaseSchema {
  @Prop({
    required: true,
    enum: UserRoleEnum,
    default: UserRoleEnum.USER,
    type: String,
  })
  role: UserRoleEnum;

  @Prop({
    default: null,
    trim: true,
    set: function (v) {
      return capitalize(v);
    },
  })
  firstname?: string;

  @Prop({
    default: null,
    trim: true,
    set: function (v) {
      return capitalize(v);
    },
  })
  lastname?: string;

  @Prop({ trim: true, lowercase: true, required: true })
  email: string;

  @Prop({
    index: true,
    set: parsePhone,
  })
  phone?: string;

  // @Prop({ type: [String], default: [] })
  // passwordRecovery?: string[];

  @Prop({
    set: function (value: string) {
      const salt = bcrypt.genSaltSync(10);
      return bcrypt.hashSync(value, salt);
    },
  })
  password?: string;

  @Prop({ default: false, required: true })
  varification: boolean;

  @Prop({ type: [Object], default: [] })
  elements?: object[];

  @Prop()
  googleId?: string;

  @Prop({ type: MediaFileSchema })
  profileMedia?: MediaFile;

  @Prop()
  refresh_token?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.index({
  phone: 1,
  role: 1,
});

UserSchema.index({
  email: 1,
  role: 1,
});

// UserSchema.index({
//   passwordRecovery: 1,
// });
