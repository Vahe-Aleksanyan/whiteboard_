import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class ElementsDto {
  @ApiProperty({ type: [Object] })
  @IsOptional()
  elements?: object[];
}
