import { ApiProperty } from '@nestjs/swagger';
import { Length, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @MinLength(8)
  @ApiProperty()
  newPassword: string;

  @ApiProperty()
  @Length(7)
  newToken: string;
}
