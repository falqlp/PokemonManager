import * as bcrypt from 'bcryptjs';
import { IUser } from '../../../domain/user/User';
import { Injectable } from '@nestjs/common';

@Injectable()
class HashService {
  private static readonly saltRounds = 10;

  public async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, HashService.saltRounds);
  }

  public async checkPassword(
    user: IUser,
    inputPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(inputPassword, user.password);
  }
}

export default HashService;
