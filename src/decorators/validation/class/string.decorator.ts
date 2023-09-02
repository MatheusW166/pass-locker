import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export const ValidateString = () => {
  const decorators = [
    IsString(),
    Transform(({ value }) => value.trim()),
    IsNotEmpty(),
  ];

  return applyDecorators(...decorators);
};
