import { Param, ParseIntPipe, ParseIntPipeOptions } from '@nestjs/common';

export const ParamId = (options?: ParseIntPipeOptions) => {
  return Param('id', new ParseIntPipe(options));
};
