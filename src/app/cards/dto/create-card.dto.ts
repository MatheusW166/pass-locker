import { CardType } from '@prisma/client';
import { ValidateString } from '@/decorators/validation';
import { IsBoolean, IsDateString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCardDto {
  @ApiProperty()
  @ValidateString()
  title: string;

  @ApiProperty()
  @ValidateString()
  number: string;

  @ApiProperty()
  @ValidateString()
  code: string;

  @ApiProperty()
  @IsDateString()
  expDate: Date;

  @ApiProperty()
  @ValidateString()
  displayName: string;

  @ApiProperty()
  @IsBoolean()
  isVirtual: boolean;

  @ApiProperty()
  @IsEnum(CardType)
  type: CardType;
}
