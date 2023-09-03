import { CardType } from '@prisma/client';
import { ValidateString } from '@/decorators/validation';
import { IsBoolean, IsDateString, IsEnum } from 'class-validator';

export class CreateCardDto {
  @ValidateString()
  title: string;

  @ValidateString()
  number: string;

  @ValidateString()
  code: string;

  @IsDateString()
  expDate: Date;

  @ValidateString()
  displayName: string;

  @IsBoolean()
  isVirtual: boolean;

  @IsEnum(CardType)
  type: CardType;
}
