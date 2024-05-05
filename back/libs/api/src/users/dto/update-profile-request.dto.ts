import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { ParsePhone } from 'libs/utils/decorator/parse-phone.decorator';

export class UpdateProfileRequestDto {
  @ApiProperty()
  @IsNotEmpty()
  firstname: string;

  @ApiProperty()
  @IsNotEmpty()
  lastname: string;

  @ApiPropertyOptional()
  @IsOptional()
  @ParsePhone()
  phone: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email: string;

  // @ApiPropertyOptional()
  // @IsOptional()
  // elements: object[];
}
