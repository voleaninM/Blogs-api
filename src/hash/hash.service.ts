import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  private salt = 10;

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.salt);
  }
  async validatePassword(
    password: string,
    hashedPass: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPass);
  }
}
