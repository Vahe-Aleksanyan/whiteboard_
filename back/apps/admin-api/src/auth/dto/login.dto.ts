import { UserRoleEnum } from 'libs/database/src/schemas/user/users.roles.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, MinLength } from 'class-validator';
import { ParseEmail } from 'libs/utils/decorator/parse-email.decorator';

export class LoginDto {
  @ApiProperty()
  @ParseEmail()
  email: string;

  @MinLength(8)
  @ApiProperty()
  password: string;

  @IsEnum(UserRoleEnum)
  @ApiProperty({ enum: UserRoleEnum, default: UserRoleEnum.ADMIN })
  role: UserRoleEnum;
}
