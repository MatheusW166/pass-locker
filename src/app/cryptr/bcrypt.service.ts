import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
  private readonly SALT = 10;

  hash(text: string) {
    return bcrypt.hashSync(text, this.SALT);
  }

  compare(plainText: string, encryptedText: string) {
    return bcrypt.compareSync(plainText, encryptedText);
  }
}
