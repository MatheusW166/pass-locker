import { applyDecorators } from '@nestjs/common';
import {} from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';

export const ValidatePositiveInt = () => {
  return applyDecorators(IsInt(), IsPositive());
};
