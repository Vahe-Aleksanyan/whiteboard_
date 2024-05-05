import { UserRoleEnum } from '@lib/database//schemas/user/users.roles.enum';
import { ApiProperty } from '@nestjs/swagger';
import {
  Allow,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  MinLength,
} from 'class-validator';
import { ParseEmail } from 'libs/utils/decorator/parse-email.decorator';
import { ParsePhone } from 'libs/utils/decorator/parse-phone.decorator';

export class LoginDto {
  @ApiProperty()
  @ParsePhone()
  @IsOptional()
  phone: string;

  @ApiProperty()
  @ParseEmail()
  @IsOptional()
  email: string;

  @MinLength(8)
  @ApiProperty()
  password: string;

  @IsEnum(UserRoleEnum)
  @ApiProperty({ enum: UserRoleEnum, default: UserRoleEnum.USER })
  role: UserRoleEnum;
}

export class LoginConfirmationDto extends LoginDto {
  @Allow()
  @ApiProperty()
  @IsNotEmpty()
  smsCode: string;
}
