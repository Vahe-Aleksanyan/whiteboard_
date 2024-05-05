import { UserRoleEnum } from '@lib/database/schemas/user/users.roles.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Exclude, Expose, Type } from 'class-transformer';
import { BaseDto } from 'libs/utils/dto/base.dto';
import { MediaFileDto } from 'libs/utils/dto/mediafile.dto';

@Exclude()
@Exclude()
export class UserProfileDto extends BaseDto {
  @ApiProperty()
  @Expose()
  firstname: string;

  @ApiProperty()
  @Expose()
  lastname: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  phone: string;

  // @ApiProperty({ type: MediaFileDto })
  // @Expose()
  // @Type(() => MediaFileDto)
  // profileMedia?: MediaFileDto;

  @Expose()
  @ApiPropertyOptional({ enum: UserRoleEnum })
  role: UserRoleEnum;
}
