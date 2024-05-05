import { ApiProperty } from '@nestjs/swagger';
import { MinLength } from 'class-validator';

export class UpdatePasswordRequestDto {
  @ApiProperty()
  @MinLength(8)
  password: string;
}
