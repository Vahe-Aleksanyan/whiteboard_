import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsOptional } from 'class-validator';

export class RefreshDto {
  @ApiProperty()
  @Allow()
  @IsOptional()
  refresh_token: string;
}
