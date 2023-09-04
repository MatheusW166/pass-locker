import { Injectable } from '@nestjs/common';
import Cryptr from 'cryptr';

@Injectable()
export class CryptrService extends Cryptr {
  constructor() {
    super(process.env.JWT_SECRET);
  }
}
