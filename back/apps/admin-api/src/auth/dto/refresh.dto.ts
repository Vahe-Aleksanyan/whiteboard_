import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsJWT } from 'class-validator';

export class RefreshDto {
  @ApiProperty()
  @Allow()
  @IsJWT()
  refresh_token: string;
}
