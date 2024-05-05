import { UserRoleEnum } from '@lib/database/schemas/user/users.roles.enum';
import { ApiProperty } from '@nestjs/swagger';

import { IsIn, IsOptional, Length, MinLength } from 'class-validator';
import { ParseEmail } from 'libs/utils/decorator/parse-email.decorator';
import { ParsePhone } from 'libs/utils/decorator/parse-phone.decorator';

export class RegisterDto {
  @ApiProperty()
  @ParsePhone()
  @IsOptional()
  phone: string;

  @ApiProperty()
  @ParseEmail()
  email: string;

  @MinLength(8)
  @ApiProperty()
  password: string;

  @ApiProperty()
  @IsOptional()
  firstname?: string;

  @ApiProperty()
  @IsOptional()
  lastname?: string;

  @IsIn([UserRoleEnum.USER])
  @ApiProperty({
    enum: [UserRoleEnum.USER],
    default: UserRoleEnum.USER,
  })
  role: UserRoleEnum.USER;
}

export class GoogleTokenDto {
  @ApiProperty()
  googleToken: string;
}

export class SmsConfirmRequestDto extends RegisterDto {
  @ApiProperty()
  @Length(4)
  sms: string;
}

export class SendWhatsappSmsDto {
  @ApiProperty()
  @ParsePhone()
  phone: string;
}
